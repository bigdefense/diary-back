export interface Stickers {
  id: number;
  user_id: number;
  sticker_id: number;
  page_type: string;
  page_date: string;
  position: Array<number>;
  size: Array<number>;
  image: string;
  image_type: string;
  priority: number;
}
