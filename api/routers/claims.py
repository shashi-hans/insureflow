import uuid
from datetime import date
from fastapi import APIRouter
from schemas import ClaimRequest, ClaimResponse

router = APIRouter()

MOCK_CLAIMS = [
    {
        "id": "cl1",
        "claim_number": "CLM-2025-0042",
        "policy_id": "pol1",
        "status": "approved",
        "claim_amount": 45000,
        "settled_amount": 42500,
        "filed_date": "2025-11-19",
        "incident_date": "2025-11-18",
        "description": "Rear-end collision at Bandra signal. Minor dent and tail lamp breakage.",
    }
]


@router.get("")
def list_claims():
    return MOCK_CLAIMS


@router.post("", response_model=ClaimResponse, status_code=201)
def file_claim(req: ClaimRequest):
    claim_id = str(uuid.uuid4())
    claim_number = f"CLM-2026-{str(uuid.uuid4().int)[:4].zfill(4)}"
    return ClaimResponse(
        id=claim_id,
        claim_number=claim_number,
        policy_id=req.policy_id,
        status="submitted",
        claim_amount=req.estimated_amount,
        filed_date=date.today().isoformat(),
        message="Claim registered successfully. Our team will contact you within 24 hours.",
    )


@router.get("/{claim_id}")
def get_claim(claim_id: str):
    for c in MOCK_CLAIMS:
        if c["id"] == claim_id:
            return c
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Claim not found")
