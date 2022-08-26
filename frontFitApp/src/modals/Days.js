import React, {useEffect, useState} from "react"
import {
    ModalPage,
    ModalPageHeader,
    PanelHeaderClose,
    usePlatform,
    PanelHeaderButton,
    IOS,
    Header,
    ANDROID,
    useAdaptivity,
    Div,
    FormItem, Select, Input, Button, CellButton, IconButton
} from "@vkontakte/vkui"
import {Icon24Back, Icon24Dismiss} from "@vkontakte/icons"

const Days = ({id,oldModal, onClose,selectDay}) => {
    const platform = usePlatform();
    return (
        <ModalPage
            id={id}
            header={
                <ModalPageHeader
                    right={
                        platform === IOS && (
                            <PanelHeaderButton onClick={onClose}>
                                <Icon24Dismiss/>
                            </PanelHeaderButton>
                        )
                    }
                    left={
                        oldModal === id ? <PanelHeaderClose onClick={onClose}/> : <IconButton onClick={onClose}><Icon24Back/></IconButton>
                    }
                >
                    День недели
                </ModalPageHeader>
            }
        >
            <Div>
                <Button size={"m"} style={{marginBottom:10}} mode={"commerce"} stretched onClick={(e)=>selectDay(e)} data-day={"pn"}>Понедельник</Button>
                <Button size={"m"} style={{marginBottom:10}} mode={"commerce"} stretched onClick={selectDay} data-day={"vt"}>Вторник</Button>
                <Button size={"m"} style={{marginBottom:10}} mode={"commerce"} stretched onClick={selectDay} data-day={"sr"}>Среда</Button>
                <Button size={"m"} style={{marginBottom:10}} mode={"commerce"} stretched onClick={selectDay} data-day={"ch"}>Четверг</Button>
                <Button size={"m"} style={{marginBottom:10}} mode={"commerce"} stretched onClick={selectDay} data-day={"pt"}>Пятница</Button>
                <Button size={"m"} style={{marginBottom:10}} mode={"commerce"} stretched onClick={selectDay} data-day={"sb"}>Суббота</Button>
                <Button size={"m"} style={{marginBottom:10}} mode={"commerce"} stretched onClick={selectDay} data-day={"vs"}>Воскресенье</Button>
            </Div>
        </ModalPage>
    )
}
export default Days