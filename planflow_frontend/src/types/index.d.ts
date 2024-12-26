export interface CardProps {
  title: string;
  imgURL?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  priority: string;
  category: string;
  status: string;
  image1?: string;
  image2?: string;
}

export interface FormValues {
  title: string;
  description: string;
  start_date?: string;
  end_date?: string;
  priority: string;
  category: string;
  status: string;
  image1?: FileList;
  image2?: FileList;
}
