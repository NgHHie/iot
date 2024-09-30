import React, { useMemo, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { useGetSalesQuery } from "state/api";

const OverviewChart = ({ isDashboard = false, view }) => {
  const theme = useTheme();
  const { data, isLoading, refetch } = useGetSalesQuery();

  // Re-fetch data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000); // 60 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [refetch]);

  const [totalDataLine, xTickValues] = useMemo(() => {
    if (!data) return [[], []];

    const totalDataLine = {
      id: view,
      data: [],
    };

    const xTickValues = [];
    const values = [...data[view]].reverse(); // Access the corresponding sub-array for the view
    const seenHours = new Set();

    const averages = {}; // Object to store total and count for averages

    values.forEach(({ ThoiGian, GiaTri }) => {
      let time = ThoiGian.split("T")[1].split(".")[0]; // hh:mm:ss
      const hourMinute = time.substring(0, 5); // Extract hh:mm from hh:mm:ss

      // Initialize the averages object for each minute
      if (!averages[hourMinute]) {
        averages[hourMinute] = { sum: 0, count: 0 };
      }

      // Sum up the value and count occurrences
      averages[hourMinute].sum += GiaTri;
      averages[hourMinute].count += 1;

      // Generate tick values every 5 minutes
      const [hour, minute] = hourMinute.split(":").map(Number);
      if (!seenHours.has(hourMinute)) {
        seenHours.add(hourMinute);
        xTickValues.push(hourMinute);
      }
    });

    // Calculate average values and populate totalDataLine
    for (const [key, { sum, count }] of Object.entries(averages)) {
      totalDataLine.data.push({ x: key, y: sum / count }); // Average for each minute
    }

    return [[totalDataLine], xTickValues];
  }, [data, view]);

  if (!data || isLoading) return "Loading...";

  const getColors = (view) => {
    switch (view) {
      case "temper":
        return [theme.palette.secondary[300], theme.palette.secondary[100]];
      case "humid":
        return [theme.palette.xanhduong[300], theme.palette.xanhduong[100]];
      case "light":
        return [theme.palette.vang[300], theme.palette.vang[100]];
      default:
        return ["#FF0000", "#0000FF"];
    }
  };

  return (
    <ResponsiveLine
      data={totalDataLine}
      colors={getColors(view)}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.neutral[0],
            },
          },
          legend: {
            text: {
              fill: theme.palette.neutral[0],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.neutral[0],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.neutral[0],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.neutral[0],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
        grid: {
          line: {
            stroke: theme.palette.neutral[10],
            strokeWidth: 1,
          },
        },
        crosshair: {
          line: {
            stroke: theme.palette.neutral[0],
            strokeWidth: 2,
            strokeDasharray: "4 3",
          },
        },
        line: {
          stroke: theme.palette.secondary[200],
        },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: view === "temper" ? 60 : view === "light" ? 4095 : 100,
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: xTickValues.filter(
          (value) => parseInt(value.split(":")[1]) % 20 === 0
        ),

        legend: isDashboard ? "" : "Time",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total ${view === "sales" ? "Revenue" : "Units"} for Day`,
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={true}
      gridYValues={
        view === "temper"
          ? [0, 10, 20, 30, 40, 50, 60]
          : view === "light"
          ? [0, 1000, 2000, 3000, 4000]
          : [0, 20, 40, 60, 80, 100]
      }
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default OverviewChart;
