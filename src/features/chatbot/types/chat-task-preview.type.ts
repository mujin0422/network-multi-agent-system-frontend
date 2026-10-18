export type ChatTaskStatus =
  | "PENDING"
  | "PLANNING"
  | "RUNNING"
  | "SUCCESS"
  | "PARTIAL_SUCCESS"
  | "FAILED"
  | "REJECTED"

/** Dữ liệu task đã join để trình bày cạnh tin nhắn, không thuộc bảng messages. */
export type ChatTaskPreview = {
  message_id: string
  task_id: string
  task_status: ChatTaskStatus
}
