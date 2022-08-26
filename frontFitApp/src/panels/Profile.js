import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Gradient,Title, Button, Group, Subhead, Div, Avatar } from '@vkontakte/vkui';

const Profile = ({ id,goToModal, go, fetchedUser }) => (
    <Panel id={id}>
        <PanelHeader>Профиль</PanelHeader>
        {fetchedUser &&
        <Group>
            <Gradient
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 32,
                }}
            >
                <Avatar size={96} src={fetchedUser.photo_200 ? fetchedUser.photo_200 : null} />
                <Title
                    style={{ marginBottom: 8, marginTop: 20 }}
                    level="2"
                    weight="2"
                >
                    {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                </Title>
                <Subhead
                   weight={"medium"}
                >
                    {fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title :
                        fetchedUser.country && fetchedUser.country.title ? fetchedUser.country.title : ''}
                </Subhead>

            </Gradient>
            <Div>
                <Button onClick={goToModal} data-modal={"calculate"} size="m" stretched mode="commerce">
                    Калькулятор Ккал
                </Button>
            </Div>
        </Group>}
    </Panel>
);

export default Profile;
