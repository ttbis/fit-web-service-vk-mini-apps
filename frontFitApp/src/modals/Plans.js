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
    FormItem, Select, Input, Button, CellButton, IconButton, Spinner
} from "@vkontakte/vkui"
import {Icon20CircleSmallFilled, Icon24Dismiss, Icon28Favorite, Icon28FavoriteOutline} from "@vkontakte/icons"

const Plans = ({id,favorites,goToExe,setFavorites,selectedType, plans, onClose, goToModal}) => {
    const platform = usePlatform();
    const addToFavorite = (e) =>{
        let id = e.currentTarget.dataset.id;
        let name = e.currentTarget.dataset.name;
        if(!favorites){
            let obj = [
                {id:id,selectedType,name_:name}
            ]
            setFavorites([...obj])
        }else{
            let oldFav = [...favorites];
            if(oldFav.find(x=>x.id === id && x.selectedType === selectedType)){
                oldFav.splice(oldFav.indexOf(oldFav.find(x=>x.id === id && x.selectedType === selectedType)),1)
                setFavorites([...oldFav])
            }else{
                oldFav.push({id:id,selectedType,name_:name})
                setFavorites([...oldFav])
            }
        }
    }
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
                        platform === ANDROID && <PanelHeaderClose onClick={onClose}/>
                    }
                >
                    Планы тренировок (
                    {selectedType && selectedType === "easy" ? "Новичек" : selectedType === "medium" ? "Опытный" : selectedType === "hard" ? "Мастер" : "" }
                    )
                </ModalPageHeader>
            }
        >
            <Div>
                {plans !== null && plans && plans.map((item, key) => {
                    return (
                        <div key={key} className={"trains_but"}>
                            <CellButton data-plan={item._id} data-name={item.name} data-modal={"days"} onClick={goToExe} centered>{item.name}</CellButton>
                            <IconButton data-name={item.name} data-id={item._id} onClick={addToFavorite}>
                                {favorites && favorites.find(x=>x.id === item._id && x.selectedType === selectedType) ?
                                    <Icon28Favorite  fill={"var(--accent)"}/>
                                    :
                                    <Icon28FavoriteOutline fill={"var(--accent)"}/>

                                }
                            </IconButton>
                        </div>)
                })}
                {plans === null &&
                    <Spinner/>

                }

            </Div>
        </ModalPage>
    )
}
export default Plans