/** Node sau khi đã chèn mốc năm xen giữa các entry. */
export type TimelineNode<T> =
  | { type: "item"; id: string; data: T }
  | { type: "year"; year: number };
