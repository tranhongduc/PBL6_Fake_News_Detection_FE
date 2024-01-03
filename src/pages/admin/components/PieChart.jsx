import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { mockPieData as data } from "../data/mockData";
import React, { useState, useEffect } from "react";
import AuthUser from "../../../utils/AuthUser";

const PieChart = ({ newsData = [], a = 1 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalCategory, setTotalCategory] = useState([]);

  const { http } = AuthUser();

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const legends = [
    {
      anchor: "bottom",
      direction: "row",
      justify: false,
      translateX: 0,
      translateY: 50,
      itemWidth: 100,
      itemHeight: 10,
      itemsSpacing: 0,
      symbolSize: 20,
      itemDirection: "left-to-right",
    },
  ];

  if (!a) {
    legends.splice(0, legends.length); // Xóa tất cả phần tử trong mảng legends nếu a là false
  }

  return (
    <ResponsivePie
      data={newsData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={legends}
    />
  );
};

export default PieChart;
