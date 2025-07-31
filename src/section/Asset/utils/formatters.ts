export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN")
}

export const formatAssetCode = (code: string): string => {
  return code.toUpperCase()
}

export const formatAssetName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1)
} 