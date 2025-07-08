export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(time) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDateTime(dateTime) {
  return new Date(dateTime).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2)
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(fileType) {
  if (fileType.startsWith("image/")) {
    return "image"
  } else if (fileType === "application/pdf") {
    return "pdf"
  } else if (fileType.includes("word") || fileType.includes("document")) {
    return "document"
  }
  return "file"
}

export function isValidFileType(fileType) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  return allowedTypes.includes(fileType)
}

export function isValidFileSize(fileSize, maxSizeInMB = 5) {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return fileSize <= maxSizeInBytes
}
