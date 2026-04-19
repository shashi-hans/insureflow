from typing import List
from fastapi import APIRouter
from schemas import PolicyResponse
from datetime import date, timedelta

router = APIRouter()

MOCK_POLICIES = [
    PolicyResponse(
        id="pol1",
        policy_number="POL-2024-HDG-001892",
        insurer_name="HDFC ERGO",
        product_type="motor",
        vehicle_number="MH04BX7842",
        vehicle_name="Maruti Swift ZXI 2022",
        status="active",
        premium=12450,
        start_date="2025-02-15",
        end_date="2026-02-14",
        days_to_expiry=345,
        idv=650000,
    ),
    PolicyResponse(
        id="pol2",
        policy_number="POL-2024-TAT-004571",
        insurer_name="Tata AIG",
        product_type="motor",
        vehicle_number="MH01AB1234",
        vehicle_name="Honda Activa 6G",
        status="expiring_soon",
        premium=3200,
        start_date="2025-03-01",
        end_date="2026-03-05",
        days_to_expiry=24,
        idv=65000,
    ),
    PolicyResponse(
        id="pol3",
        policy_number="POL-2024-ICL-008831",
        insurer_name="ICICI Lombard",
        product_type="health",
        status="active",
        premium=28000,
        start_date="2025-01-01",
        end_date="2026-01-01",
        days_to_expiry=301,
        sum_insured=1000000,
    ),
]


@router.get("", response_model=List[PolicyResponse])
def list_policies():
    return MOCK_POLICIES


@router.get("/{policy_id}", response_model=PolicyResponse)
def get_policy(policy_id: str):
    for p in MOCK_POLICIES:
        if p.id == policy_id:
            return p
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Policy not found")
