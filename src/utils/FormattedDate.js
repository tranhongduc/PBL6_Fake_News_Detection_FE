import dayjs from "dayjs";
import "dayjs/locale/en"; 
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Định dạng ngày tháng
const DATE_FORMAT = "YYYY-MM-DD";

dayjs.extend(customParseFormat);
dayjs.locale("en");

// Chuyển đổi đối tượng Moment thành chuỗi ngày tháng
const FormattedDate = (momentObject) => {
  return dayjs(momentObject).format(DATE_FORMAT);
};

export default FormattedDate;