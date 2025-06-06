import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
	BarChart,
	CartesianGrid,
	Bar,
	XAxis,
	YAxis,
	Label,
	ResponsiveContainer,
} from "recharts";
import { startOfHour, format /*, startOfDay, endOfDay,*/, parseISO } from "date-fns";

import { i18n } from "../../translate/i18n";

import Title from "./Title";

const Chart = ({ tickets, users = null }) => {
	const theme = useTheme();

	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		setChartData([
			{ time: "01:00", amount: 0 },
			{ time: "02:00", amount: 0 },
			{ time: "03:00", amount: 0 },
			{ time: "04:00", amount: 0 },
			{ time: "05:00", amount: 0 },
			{ time: "06:00", amount: 0 },
			{ time: "07:00", amount: 0 },
			{ time: "08:00", amount: 0 },
			{ time: "09:00", amount: 0 },
			{ time: "10:00", amount: 0 },
			{ time: "11:00", amount: 0 },
			{ time: "12:00", amount: 0 },
			{ time: "13:00", amount: 0 },
			{ time: "14:00", amount: 0 },
			{ time: "15:00", amount: 0 },
			{ time: "16:00", amount: 0 },
			{ time: "17:00", amount: 0 },
			{ time: "18:00", amount: 0 },
			{ time: "19:00", amount: 0 },
			{ time: "20:00", amount: 0 },
			{ time: "21:00", amount: 0 },
			{ time: "22:00", amount: 0 },
			{ time: "23:00", amount: 0 },
			{ time: "00:00", amount: 0 },
		]);
		setChartData(prevState => {
			let aux = [...prevState];

			aux.forEach(a => {
				tickets.forEach(ticket => {
					format(startOfHour(parseISO(ticket.createdAt)), "HH:mm") === a.time &&
						a.amount++;
				});
			});

			return aux;
		});
	}, [tickets]);

	return (
		<React.Fragment>
			<Title>{`${i18n.t("dashboard.charts.perDay.title")}${tickets.length
				}`}</Title>
			<ResponsiveContainer>
				<BarChart
					data={chartData}
					barSize={40}
					width={730}
					height={250}
					margin={{
						top: 16,
						right: 16,
						bottom: 0,
						left: 24,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="time" stroke={theme.palette.text.secondary} />
					<YAxis
						type="number"
						allowDecimals={false}
						stroke={theme.palette.text.secondary}
					>
						<Label
							angle={270}
							position="left"
							style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
						>
							Tickets
						</Label>
					</YAxis>
					<Bar dataKey="amount" fill={"#6F42C1"} />
				</BarChart>
			</ResponsiveContainer>
		</React.Fragment>
	);
};

export default Chart;
