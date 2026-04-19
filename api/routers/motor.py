import uuid
import random
from typing import List
from fastapi import APIRouter, HTTPException
from schemas import QuoteRequest, QuoteResponse, InsurancePlan, PremiumBreakup, PlanAddon

router = APIRouter()

# ── Mock insurer data ─────────────────────────────────────────────────────

INSURERS = [
    {
        "slug": "hdfc-ergo",
        "name": "HDFC ERGO",
        "csr": 98.2,
        "garages": 6900,
        "recommended": True,
        "tags": ["Best Value", "Fastest Claims"],
        "base_rate": 0.018,  # % of IDV
    },
    {
        "slug": "tata-aig",
        "name": "Tata AIG",
        "csr": 96.4,
        "garages": 5500,
        "recommended": False,
        "tags": ["Popular", "Quick Settlement"],
        "base_rate": 0.0155,
        "popular": True,
    },
    {
        "slug": "icici-lombard",
        "name": "ICICI Lombard",
        "csr": 97.8,
        "garages": 8500,
        "recommended": False,
        "tags": ["Most Cashless Garages", "Premium Cover"],
        "base_rate": 0.021,
    },
    {
        "slug": "acko",
        "name": "ACKO",
        "csr": 95.1,
        "garages": 1900,
        "recommended": False,
        "tags": ["Lowest Premium", "Digital-First"],
        "base_rate": 0.013,
    },
]

ADDON_CATALOG = [
    PlanAddon(id="zero_dep", name="Zero Depreciation", premium=1200, description="Full claim without depreciation deduction", popular=True),
    PlanAddon(id="engine", name="Engine Protection", premium=950, description="Covers engine damage due to water ingression"),
    PlanAddon(id="rsa", name="Roadside Assistance", premium=350, description="24x7 on-road assistance", popular=True),
    PlanAddon(id="ncb_protect", name="NCB Protection", premium=650, description="Protect your No Claim Bonus after a claim"),
    PlanAddon(id="invoice", name="Return to Invoice", premium=1800, description="Get invoice value for total loss"),
    PlanAddon(id="consumables", name="Consumables Cover", premium=550, description="Covers nuts, bolts, oils during repairs"),
]

NCB_RATES = {0: 0.0, 20: 0.20, 25: 0.25, 35: 0.35, 45: 0.45, 50: 0.50}

# ── Pricing engine ────────────────────────────────────────────────────────

def compute_idv(year: int, base_value: int = 700000) -> int:
    """Simple IDV depreciation: 5% per year after first year."""
    age = 2026 - year
    depreciation = min(0.5, age * 0.05)
    return int(base_value * (1 - depreciation))


def compute_premium(idv: int, base_rate: float, ncb_percent: int, coverage_type: str) -> PremiumBreakup:
    if coverage_type == "third_party":
        base = 2100
    elif coverage_type == "own_damage":
        base = int(idv * base_rate * 0.7)
    else:
        base = int(idv * base_rate)

    ncb_discount = int(base * NCB_RATES.get(ncb_percent, 0))
    after_ncb = base - ncb_discount
    gst = int(after_ncb * 0.18)
    total = after_ncb + gst

    return PremiumBreakup(
        base_premium=base,
        addon_premium=0,
        ncb_discount=ncb_discount,
        gst=gst,
        total=total,
    )


def build_coverages(coverage_type: str, insurer_slug: str) -> dict:
    base = {
        "Own Damage": coverage_type != "third_party",
        "Third Party": coverage_type != "own_damage",
        "Personal Accident": True,
    }
    if coverage_type == "comprehensive":
        base.update({
            "Engine Protection": insurer_slug in ("tata-aig", "icici-lombard"),
            "Zero Depreciation": insurer_slug in ("hdfc-ergo", "icici-lombard"),
            "Roadside Assist": insurer_slug != "acko",
            "Invoice Cover": insurer_slug == "icici-lombard",
            "NCB Protection": insurer_slug in ("hdfc-ergo", "icici-lombard"),
        })
    return base


# ── Endpoints ─────────────────────────────────────────────────────────────

@router.post("/quote", response_model=QuoteResponse)
def get_quote(req: QuoteRequest):
    idv = req.idv or compute_idv(req.vehicle.year)
    idv_min = int(idv * 0.7)
    idv_max = int(idv * 1.3)

    plans: List[InsurancePlan] = []
    for ins in INSURERS:
        breakup = compute_premium(idv, ins["base_rate"], req.ncb_percent, req.coverage_type)
        coverages = build_coverages(req.coverage_type, ins["slug"])

        # Filter addons per insurer
        available_addons = [a for a in ADDON_CATALOG if random.random() > 0.3][:4]

        plan = InsurancePlan(
            id=f"{ins['slug']}-{uuid.uuid4().hex[:6]}",
            insurer_slug=ins["slug"],
            insurer_name=ins["name"],
            coverage_type=req.coverage_type,
            idv=idv,
            premium=breakup.total,
            breakup=breakup,
            claim_settlement_ratio=ins["csr"],
            cashless_garages=ins["garages"],
            coverages=coverages,
            addons=available_addons,
            recommended=ins.get("recommended", False),
            popular=ins.get("popular", False),
            tags=ins["tags"],
        )
        plans.append(plan)

    # Sort: recommended first, then by premium
    plans.sort(key=lambda p: (not p.recommended, p.premium))

    return QuoteResponse(
        quote_id=str(uuid.uuid4()),
        plans=plans,
        vehicle=req.vehicle,
        idv_min=idv_min,
        idv_max=idv_max,
    )


@router.get("/vehicle/{reg_no}")
def lookup_vehicle(reg_no: str):
    """Mock vehicle lookup by registration number."""
    if len(reg_no) < 8:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Return mock data based on registration
    return {
        "registration_number": reg_no.upper(),
        "make": "Maruti Suzuki",
        "model": "Swift",
        "variant": "ZXI",
        "year": 2022,
        "fuel_type": "Petrol",
        "city": "Mumbai",
        "owner_name": "",
    }
