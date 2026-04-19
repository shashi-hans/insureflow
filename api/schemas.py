from pydantic import BaseModel, Field
from typing import Optional, Literal, List, Dict, Union
from enum import Enum


class CoverageType(str, Enum):
    comprehensive = "comprehensive"
    third_party = "third_party"
    own_damage = "own_damage"


class PolicyType(str, Enum):
    new = "new"
    renewal = "renewal"


class FuelType(str, Enum):
    petrol = "Petrol"
    diesel = "Diesel"
    cng = "CNG"
    electric = "Electric"
    hybrid = "Hybrid"


# ── Request schemas ───────────────────────────────────────────────────────

class VehicleDetails(BaseModel):
    registration_number: Optional[str] = None
    make: str
    model: str
    variant: Optional[str] = None
    year: int = Field(ge=2000, le=2026)
    fuel_type: FuelType
    city: str


class QuoteRequest(BaseModel):
    vehicle: VehicleDetails
    coverage_type: CoverageType = CoverageType.comprehensive
    ncb_percent: Literal[0, 20, 25, 35, 45, 50] = 0
    idv: Optional[int] = None
    claimed_last_year: bool = False
    addons: List[str] = []
    owner_name: str
    owner_phone: str
    owner_email: Optional[str] = None


class ClaimRequest(BaseModel):
    policy_id: str
    incident_date: str
    incident_type: str
    description: str
    estimated_amount: Optional[int] = None
    fir_number: Optional[str] = None


# ── Response schemas ──────────────────────────────────────────────────────

class PremiumBreakup(BaseModel):
    base_premium: int
    addon_premium: int
    ncb_discount: int
    gst: int
    total: int


class PlanAddon(BaseModel):
    id: str
    name: str
    premium: int
    description: str
    popular: bool = False


class InsurancePlan(BaseModel):
    id: str
    insurer_slug: str
    insurer_name: str
    coverage_type: CoverageType
    idv: int
    premium: int
    breakup: PremiumBreakup
    claim_settlement_ratio: float
    cashless_garages: int
    coverages: Dict[str, Union[bool, str]]
    addons: List[PlanAddon]
    recommended: bool = False
    popular: bool = False
    tags: List[str] = []


class QuoteResponse(BaseModel):
    quote_id: str
    plans: List[InsurancePlan]
    vehicle: VehicleDetails
    idv_min: int
    idv_max: int


class PolicyResponse(BaseModel):
    id: str
    policy_number: str
    insurer_name: str
    product_type: str
    vehicle_number: Optional[str] = None
    vehicle_name: Optional[str] = None
    status: str
    premium: int
    start_date: str
    end_date: str
    days_to_expiry: int
    idv: Optional[int] = None
    sum_insured: Optional[int] = None


class ClaimResponse(BaseModel):
    id: str
    claim_number: str
    policy_id: str
    status: str
    claim_amount: Optional[int] = None
    filed_date: str
    message: str
