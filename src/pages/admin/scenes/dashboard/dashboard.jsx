import "./Dashboard.css";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import {
  mockPieMonth as data,
  mockBarNew as dataBar,
  mockLineComment as dataLine,
} from "../../data/mockData";
import EmailIcon from "@mui/icons-material/Email";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Select } from "antd";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import React, { useState, useEffect } from "react";
import AuthUser from "../../../../utils/AuthUser";

const Dashboard = () => {
  const { http } = AuthUser();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [total, setTotal] = useState([]);
  const [totalCategory, setTotalCategory] = useState([]);

  const [barNews, setBarNews] = useState([]);
  const [lineComment, setLineComment] = useState([]);
  const years = [];
  const currentYear = new Date().getFullYear();

  const [yearss, setYearss] = useState(currentYear);
  const [yearsc, setYearsC] = useState(currentYear);

  for (let year = currentYear - 10; year <= currentYear; year++) {
    years.push(year);
  }

  //fake

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateMockBarNew() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const mockBarNew = months.map((month) => ({
      real: getRandomNumber(100, 999),
      fake: getRandomNumber(100, 999),
      month: month,
    }));

    return mockBarNew;
  }

  function generateMockLineComment() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const mockLineComment = {
      id: "comment",
      color: tokens("dark").greenAccent[500],
      data: months.map((month) => ({
        x: month,
        y: month === "December" ? 14 : getRandomNumber(100, 999),
      })),
    };

    return [mockLineComment];
  }

  const fetchNews = async (year) => {
    await http
      .get(`/admin/total_news/${year}`)
      .then((resolve) => {
        console.log("total_news:", resolve);
        const newData = [];

        for (const key in resolve.data.total_fake_news) {
          const month = resolve.data.total_fake_news[key].month;
          const realValue = resolve.data.total_real_news[key].total;
          const fakeValue = resolve.data.total_fake_news[key].total;

          newData.push({ real: realValue, fake: fakeValue, month });
        }
        // Cập nhật dữ liệu sau khi chuyển đổi
        // setBarNews(newData);
        setBarNews(dataBar);
      })
      .catch((reject) => {
        console.log(reject);
      });
  };

  const fetchComment = async (year) => {
    await http
      .get(`/admin/total_comments/${year}`)
      .then((resolve) => {
        console.log("total_comments:", resolve);

        // Cập nhật dữ liệu sau khi chuyển đổi
        setLineComment(resolve.data.total_comment);
      })
      .catch((reject) => {
        console.log(reject);
      });
  };

  const handleSelectYearNews = (selectedOption) => {
    // Xử lý sự kiện khi người dùng chọn option
    const data = generateMockBarNew();
    setBarNews(data);
    // fetchNews(selectedOption);
    setYearss(selectedOption);
  };
  const handleSelectYearComment = (selectedOption) => {
    // Xử lý sự kiện khi người dùng chọn option
    const data = generateMockLineComment();
    setLineComment(data);
    // fetchComment(selectedOption);
    setYearsC(selectedOption);
  };

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/admin/total_news/${currentYear}`)
        .then((resolve) => {
          console.log("total_news:", resolve);
          const newData = [];

          for (const key in resolve.data.total_fake_news) {
            const month = resolve.data.total_fake_news[key].month;
            const realValue = resolve.data.total_real_news[key].total;
            const fakeValue = resolve.data.total_fake_news[key].total;

            newData.push({ real: realValue, fake: fakeValue, month });
          }
          // Cập nhật dữ liệu sau khi chuyển đổi
          // setBarNews(newData);
          setBarNews(dataBar);
        })
        .catch((reject) => {
          console.log(reject);
        });
      await http
        .get(`/admin/total_comments/${2023}`)
        .then((resolve) => {
          console.log("total_comments:", resolve);
          // setLineComment(resolve.data.total_comment);
          setLineComment(dataLine);
        })
        .catch((reject) => {
          console.log(reject);
        });
      await http
        .get(`/admin/total_month/`)
        .then((resolve) => {
          console.log("total_month:", resolve);
        })
        .catch((reject) => {
          console.log(reject);
        });
      await http
        .get(`/admin/total_category/`)
        .then((resolve) => {
          console.log("total_category:", resolve);
          const categoriesData = resolve.data.categories;

          const updatedCategories = categoriesData.map((category) => {
            return {
              ...category,
              label: category.name,
              value: category.news_count,
            };
          });

          setTotalCategory(updatedCategories);
        })
        .catch((reject) => {
          console.log(reject);
        });
      await http
        .get(`/admin/total/`)
        .then((resolve) => {
          console.log("total:", resolve);
          setTotal(resolve.data);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={total.total_comment}
            subtitle="Comment"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={total.total_news}
            subtitle="News"
            progress="0.50"
            increase="+21%"
            icon={
              <NewspaperIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={total.total_user}
            subtitle="User"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Comment in month
              </Typography>
            </Box>
            <Box>
              <Box>
                <Select
                  placeholder="Please select Year"
                  options={years.map((year) => ({
                    label: year.toString(),
                    value: year,
                  }))}
                  onChange={handleSelectYearComment}
                />
              </Box>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} newData={lineComment} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            News in category
          </Typography>
          <PieChart newsData={totalCategory} a={0} />
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="600">
                Total news
              </Typography>
            </Box>
            <Box>
              <Select
                placeholder="Please select Year"
                options={years.map((year) => ({
                  label: year.toString(),
                  value: year,
                }))}
                onChange={handleSelectYearNews}
              />
            </Box>
          </Box>

          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} newsData={barNews} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Total in month
          </Typography>
          <PieChart newsData={data} a={0} />
        </Box>

        {/* ROW 4 */}
      </Box>
    </Box>
  );
};

export default Dashboard;
