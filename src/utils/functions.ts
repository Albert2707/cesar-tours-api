import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string | undefined): string | null => {
    if (!dateString) return null;
  
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date provided:", dateString);
      return null;
    }
  
    return format(date, 'yyyy-MM-dd');
  };
export const formatToDatabaseDate = (date: string): string => {
    const parsedDate = parseISO(date);
    return format(parsedDate, 'yyyy-MM-dd');
  };
  