export interface Word {
  id: number;
  term: string;
  type: string;
  tags: string[];
  part_of_speech: string | null;
}
