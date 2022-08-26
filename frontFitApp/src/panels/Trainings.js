import React from 'react';
import PropTypes from 'prop-types';

import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, CellButton, IconButton} from '@vkontakte/vkui';
import {Icon28Favorite, Icon28FavoriteOutline} from "@vkontakte/icons";
import { Icon20CircleSmallFilled } from '@vkontakte/icons';
const Trainings = ({ id, go,goToModal }) => (
	<Panel id={id}>
		<PanelHeader>Тренировки</PanelHeader>
		<Group >
			<div className={"trains_but"}>
				<CellButton data-type={"easy"} data-modal={"plans"} onClick={goToModal} before={<Icon20CircleSmallFilled fill={"green"}/>} centered >Новичок</CellButton>

			</div>
			<div className={"trains_but"}>
				<CellButton data-type={"medium"} data-modal={"plans"} onClick={goToModal} before={<Icon20CircleSmallFilled fill={"yellow"}/>} centered >Опытный</CellButton>

			</div>
			<div className={"trains_but"}>
				<CellButton data-type={"hard"} data-modal={"plans"} onClick={goToModal} before={<Icon20CircleSmallFilled fill={"red"}/>} centered >Мастер</CellButton>

			</div>

		</Group>
	</Panel>
);

export default Trainings;
