import type { Partner } from "~/interfaces/responses/pages/about-us/Partner";

export interface AboutUs {
  title_1: string;
  content_1: string;
  title_2: string;
  content_2: string;
  title_3: string;
  content_3: string;
  title_4: string;
  content_4: string;
  imagePath: string;
  partners: Partner[];
}
