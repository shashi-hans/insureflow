export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-IN').format(n)

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export const getDaysToExpiry = (endDate: string): number => {
  const diff = new Date(endDate).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const claimStatusLabel: Record<string, string> = {
  submitted:    'Submitted',
  under_review: 'Under Review',
  surveyed:     'Surveyed',
  approved:     'Approved',
  settled:      'Settled',
  rejected:     'Rejected',
}

export const claimStatusColor: Record<string, string> = {
  submitted:    'bg-blue-100 text-blue-700',
  under_review: 'bg-amber-100 text-amber-700',
  surveyed:     'bg-purple-100 text-purple-700',
  approved:     'bg-teal-100 text-teal-700',
  settled:      'bg-mint-100 text-green-700',
  rejected:     'bg-red-100 text-red-700',
}
