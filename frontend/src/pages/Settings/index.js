import React, { useState, useEffect } from "react";
import openSocket from "../../services/socket-io";
import { useHistory } from "react-router-dom";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";

import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";
import { FormControl, InputLabel } from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(8, 8, 3),
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
		marginBottom: 12,

	},

	settingOption: {
		marginLeft: "auto",
	},

	margin: {
		margin: theme.spacing(1),
	},

	maxWidth: {
		width: "100%",
	},
}));

const IOSSwitch = withStyles((theme) => ({
	root: {
		width: 42,
		height: 26,
		padding: 0,
		margin: theme.spacing(1),
	},
	switchBase: {
		padding: 1,
		'&$checked': {
			transform: 'translateX(16px)',
			color: theme.palette.common.white,
			'& + $track': {
				backgroundColor: '#52d869',
				opacity: 1,
				border: 'none',
			},
		},
		'&$focusVisible $thumb': {
			color: '#52d869',
			border: '6px solid #fff',
		},
	},
	thumb: {
		width: 24,
		height: 24,
	},
	track: {
		borderRadius: 26 / 2,
		border: `1px solid ${theme.palette.grey[400]}`,
		backgroundColor: theme.palette.grey[50],
		opacity: 1,
		transition: theme.transitions.create(['background-color', 'border']),
	},
	checked: {},
	focusVisible: {},
}))
	(({ classes, ...props }) => {
		return (
			<Switch
				focusVisibleClassName={classes.focusVisible}
				disableRipple
				classes={{
					root: classes.root,
					switchBase: classes.switchBase,
					thumb: classes.thumb,
					track: classes.track,
					checked: classes.checked,
				}}
				{...props}
			/>
		);
	});


const Settings = () => {
	const classes = useStyles();
	const [settings, setSettings] = useState([]);
	const [company, setCompany] = useState(0);
	const [queues, setQueues] = useState([]);
	const history = useHistory();

	useEffect(() => {
		const fetchSession = async () => {
			const token = localStorage.getItem("token");
			const userJWT = jwt_decode(token);
			setCompany(userJWT.companyId);

			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}

			try {
				const { data } = await api.get("/queue");
				setQueues(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
	}, []);

	useEffect(() => {
		const socket = openSocket();
		const token = localStorage.getItem("token");
		const userJWT = jwt_decode(token);

		socket.on(`settings-${userJWT.companyId}`, data => {
			if (data.action === "update") {
				setSettings(prevState => {
					const aux = [...prevState];
					const settingIndex = aux.findIndex(s => s.key === data.setting.key);
					aux[settingIndex].value = data.setting.value;
					return aux;
				});
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleChangeBooleanSetting = async e => {
		const selectedValue = e.target.checked ? "enabled" : "disabled";
		const settingKey = e.target.name;

		try {
			await api.put(`/settings/${settingKey}`, {
				value: selectedValue,
			});
			toast.success(i18n.t("settings.success"));
			history.go(0);
		} catch (err) {
			toastError(err);
		}
	};

	const handleChangeSetting = async e => {
		const selectedValue = e.target.value;
		const settingKey = e.target.name;

		try {
			await api.put(`/settings/${settingKey}`, {
				value: selectedValue,
			});
			toast.success(i18n.t("settings.success"));
		} catch (err) {
			toastError(err);
		}
	};

	const getSettingValue = key => {
		try {
			const { value } = settings.find(s => s.key === key);
			return value;
		} catch (error) {
			return ''
		}
	};

	return (
		<div className={classes.root}>
			<Container className={classes.container} maxWidth="sm">
				<Typography variant="body2" gutterBottom>
					{i18n.t("settings.title") + ` ${(company && Number(company) > 0) ? 'empresa' : 'super admin'}`}
				</Typography>

				{(company && Number(company) > 0) ?
					<Container className={classes.container} maxWidth="sm">
						{/* < Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.allowUserEditConnection.name")}</InputLabel>
								<Select
									native
									fullWidth
									id="allowUserEditConnection-setting"
									name="allowUserEditConnection"
									label={i18n.t("settings.settings.allowUserEditConnection.name")}
									value={settings && settings.length > 0 && getSettingValue("allowUserEditConnection")}
									className={classes.settingOption}
									onChange={handleChangeSetting}
								>
									<option value="enabled">
										{i18n.t("settings.settings.allowUserEditConnection.options.enabled")}
									</option>
									<option value="disabled">
										{i18n.t("settings.settings.allowUserEditConnection.options.disabled")}
									</option>
								</Select>
							</FormControl>
						</Paper> */}
						<Typography variant="body2" gutterBottom></Typography>
						<Paper className={classes.paper}>
							<Tooltip title={i18n.t("settings.settings.allowUserEditConnection.note")}>
								<FormControlLabel
									control={
										<IOSSwitch
											checked={settings && settings.length > 0 && getSettingValue("allowUserEditConnection") === "enabled"}
											onChange={handleChangeBooleanSetting} name="allowUserEditConnection"
										/>}
									label={i18n.t("settings.settings.allowUserEditConnection.name")}
								/>
							</Tooltip>
						</Paper>
						{/* < Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.hideTicketWithoutDepartment.name")}</InputLabel>
								<Select
									native
									fullWidth
									id="hideTicketWithoutDepartment-setting"
									name="hideTicketWithoutDepartment"
									label={i18n.t("settings.settings.hideTicketWithoutDepartment.name")}
									value={settings && settings.length > 0 && getSettingValue("hideTicketWithoutDepartment")}
									className={classes.settingOption}
									onChange={handleChangeSetting}
								>
									<option value="enabled">
										{i18n.t("settings.settings.hideTicketWithoutDepartment.options.enabled")}
									</option>
									<option value="disabled">
										{i18n.t("settings.settings.hideTicketWithoutDepartment.options.disabled")}
									</option>
								</Select>
							</FormControl>
						</Paper> */}

						<Typography variant="body2" gutterBottom></Typography>

						<Paper className={classes.paper}>
							<Tooltip title={i18n.t("settings.settings.CheckMsgIsGroup.note")}>
								<FormControlLabel
									control={
										<IOSSwitch
											checked={settings && settings.length > 0 && getSettingValue("CheckMsgIsGroup") === "enabled"}
											onChange={handleChangeBooleanSetting} name="CheckMsgIsGroup"
										/>
									} label={i18n.t("settings.settings.CheckMsgIsGroup.name")}
								/>
							</Tooltip>
						</Paper>

						<Typography variant="body2" gutterBottom></Typography>

						<Paper className={classes.paper}>
							<Tooltip title={i18n.t("settings.settings.call.note")}>
								<FormControlLabel
									control={
										<IOSSwitch
											checked={settings && settings.length > 0 && getSettingValue("call") === "enabled"}
											onChange={handleChangeBooleanSetting} name="call"
										/>
									} label={i18n.t("settings.settings.call.name")}
								/>
							</Tooltip>
						</Paper>

						<Typography variant="body2" gutterBottom></Typography>
						<Paper className={classes.paper}>
							<Tooltip title={i18n.t("settings.settings.hideTicketWithoutDepartment.note")}>
								<FormControlLabel
									control={
										<IOSSwitch
											checked={settings && settings.length > 0 && getSettingValue("hideTicketWithoutDepartment") === "enabled"}
											onChange={handleChangeBooleanSetting} name="hideTicketWithoutDepartment"
										/>}
									label={i18n.t("settings.settings.hideTicketWithoutDepartment.name")}
								/>
							</Tooltip>
						</Paper>
						{/* <Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.useBotByQueueSample.name")}</InputLabel>
								<Select
									native
									fullWidth
									id="useBotByQueueSample-setting"
									name="useBotByQueueSample"
									label={i18n.t("settings.settings.useBotByQueueSample.name")}
									value={settings && settings.length > 0 && getSettingValue("useBotByQueueSample")}
									className={classes.settingOption}
									onChange={handleChangeSetting}
								>
									<option value="enabled">
										{i18n.t("settings.settings.useBotByQueueSample.options.enabled")}
									</option>
									<option value="disabled">
										{i18n.t("settings.settings.useBotByQueueSample.options.disabled")}
									</option>
								</Select>
							</FormControl>
						</Paper> */}

						<Typography variant="body2" gutterBottom></Typography>
						<Paper className={classes.paper}>
							<Tooltip title={i18n.t("settings.settings.useBotByQueueSample.note")}>
								<FormControlLabel
									control={
										<IOSSwitch
											checked={settings && settings.length > 0 && getSettingValue("useBotByQueueSample") === "enabled"}
											onChange={handleChangeBooleanSetting} name="useBotByQueueSample"
										/>}
									label={i18n.t("settings.settings.useBotByQueueSample.name")}
								/>
							</Tooltip>
						</Paper>


						<Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.tickets.autoClose.name")}</InputLabel>
								<Select
									native
									fullWidth
									className={classes.settingOption}
									id="ticketAutoClose-setting"
									name="ticketAutoClose"
									label={i18n.t("settings.settings.tickets.autoClose.name")}
									value={settings && getSettingValue("ticketAutoClose")}
									onChange={handleChangeSetting}
								>
									<option value="0">{i18n.t("settings.settings.tickets.autoClose.options.disabled")}</option>
									<option value="1">{`1 ${i18n.t("settings.settings.tickets.autoClose.options.hour")}`}</option>
									<option value="2">{`2 ${i18n.t("settings.settings.tickets.autoClose.options.hours")}`}</option>
									<option value="5">{`5 ${i18n.t("settings.settings.tickets.autoClose.options.hours")}`}</option>
									<option value="10">{`10 ${i18n.t("settings.settings.tickets.autoClose.options.hours")}`}</option>
									<option value="20">{`20 ${i18n.t("settings.settings.tickets.autoClose.options.hours")}`}</option>
									<option value="23">{`23 ${i18n.t("settings.settings.tickets.autoClose.options.hours")}`}</option>
								</Select>
							</FormControl>
						</Paper>
						<Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.tickets.timeCreateNewTicket.name")}</InputLabel>
								<Select
									native
									fullWidth
									className={classes.settingOption}
									id="timeCreateNewTicket-setting"
									name="timeCreateNewTicket"
									label={i18n.t("settings.settings.tickets.timeCreateNewTicket.name")}
									value={settings && getSettingValue("timeCreateNewTicket")}
									onChange={handleChangeSetting}
								>
									<option value="0">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.disabled")}</option>
									<option value="10">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.10")}</option>
									<option value="30">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.30")}</option>
									<option value="60">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.60")}</option>
									<option value="300">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.300")}</option>
									<option value="1800">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.1800")}</option>
									<option value="3600">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.3600")}</option>
									<option value="7200">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.7200")}</option>
									<option value="21600">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.21600")}</option>
									<option value="43200">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.43200")}</option>
									<option value="86400">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.86400")}</option>
									<option value="604800">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.604800")}</option>
									<option value="1296000">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.1296000")}</option>
									<option value="2592000">{i18n.t("settings.settings.tickets.timeCreateNewTicket.options.2592000")}</option>
								</Select>
							</FormControl>
						</Paper>
						<Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.tickets.transfer.afterMinutes")}</InputLabel>
								<Select
									native
									fullWidth
									className={classes.settingOption}
									id="afterMinutesToTransfer-setting"
									name="afterMinutesToTransfer"
									label={i18n.t("settings.settings.tickets.transfer.afterMinutes")}
									value={settings && getSettingValue("afterMinutesToTransfer")}
									onChange={handleChangeSetting}
								>
									<option value="0">{i18n.t("settings.settings.tickets.transfer.options.disabled")}</option>
									<option value="10">{i18n.t("settings.settings.tickets.transfer.options.10")}</option>
									<option value="30">{i18n.t("settings.settings.tickets.transfer.options.30")}</option>
									<option value="60">{i18n.t("settings.settings.tickets.transfer.options.60")}</option>
									<option value="300">{i18n.t("settings.settings.tickets.transfer.options.300")}</option>
									<option value="600">{i18n.t("settings.settings.tickets.transfer.options.600")}</option>
									<option value="900">{i18n.t("settings.settings.tickets.transfer.options.900")}</option>
									<option value="1200">{i18n.t("settings.settings.tickets.transfer.options.1200")}</option>
									<option value="1800">{i18n.t("settings.settings.tickets.transfer.options.1800")}</option>
								</Select>
							</FormControl>
						</Paper>
						<Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.tickets.transfer.autoTransfer")}</InputLabel>
								<Select
									native
									fullWidth
									className={classes.settingOption}
									id="afterMinutesTicketWithoutDepartmentTransferTo-setting"
									name="afterMinutesTicketWithoutDepartmentTransferTo"
									label={i18n.t("settings.settings.tickets.transfer.autoTransfer")}
									value={settings && getSettingValue("afterMinutesTicketWithoutDepartmentTransferTo")}
									onChange={handleChangeSetting}
								>
									{queues.map((queue) => (
										<option key={queue.id} value={queue.id}>{queue.name}</option>
									))}
								</Select>
							</FormControl>
						</Paper>
						{(getSettingValue("showApiKeyInCompanies") === "enabled") ?
							<Paper className={classes.paper}>
								<FormControl variant="outlined" className={classes.maxWidth}>
									<TextField
										native
										multiline
										rows={5}
										fullWidth
										readonly
										id="api-token-setting"
										margin="dense"
										variant="outlined"
										label={i18n.t("settings.settings.apiKey.name")}
										value={settings && settings.length > 0 && getSettingValue(`userApiToken`)}
									/>
								</FormControl>
							</Paper>
							: null}

					</Container> :

					<Container className={classes.container} maxWidth="sm">
						<Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.userCreation.name")}</InputLabel>
								<Select
									native
									fullWidth
									className={classes.settingOption}
									id="userCreation-setting"
									name="userCreation"
									label={i18n.t("settings.settings.userCreation.name")}
									value={settings && settings.length > 0 && getSettingValue("userCreation")}
									onChange={handleChangeSetting}
								>
									<option value="enabled">
										{i18n.t("settings.settings.userCreation.options.enabled")}
									</option>
									<option value="disabled">
										{i18n.t("settings.settings.userCreation.options.disabled")}
									</option>
								</Select>
							</FormControl>
						</Paper>
						<Paper className={classes.paper}>
							<FormControl variant="outlined" className={classes.maxWidth}>
								<InputLabel>{i18n.t("settings.settings.showApiKeyInCompanies.name")}</InputLabel>
								<Select
									native
									fullWidth
									className={classes.settingOption}
									id="showApiKeyInCompanies-setting"
									name="showApiKeyInCompanies"
									label={i18n.t("settings.settings.showApiKeyInCompanies.name")}
									value={settings && settings.length > 0 && getSettingValue("showApiKeyInCompanies")}
									onChange={handleChangeSetting}
								>
									<option value="enabled">
										{i18n.t("settings.settings.showApiKeyInCompanies.options.enabled")}
									</option>
									<option value="disabled">
										{i18n.t("settings.settings.showApiKeyInCompanies.options.disabled")}
									</option>
								</Select>
							</FormControl>
						</Paper>
					</Container>
				}

			</Container>
		</div >
	);
};

export default Settings;
