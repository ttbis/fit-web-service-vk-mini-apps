import React from 'react';
import PropTypes from 'prop-types';

import {
    Panel,
    PanelHeader,
    SimpleCell,
    Button,
    Group,
    Cell,
    Div,
    Alert,
    CellButton,
    IconButton, ScreenSpinner
} from '@vkontakte/vkui';
import {Icon20CircleSmallFilled, Icon28Favorite, Icon28FavoriteOutline} from "@vkontakte/icons";

const Eat = ({ id,bridge,setSelectedEatPlan,goEat,favorites,setFavorites, go,goToModal,setPopout }) => {
    const click = (e) =>{
        setPopout(<ScreenSpinner/>)
        let c = e.currentTarget.dataset.type;
        bridge.send("VKWebAppStorageGet", {"keys": ["calculate"]}).then(r=>{
            setPopout(null)
            if(!r.keys[0].value){
                setPopout( <Alert
                    actions={[
                        {
                            title: "Рассчитать",
                            mode: "commerce",
                            autoclose: true,
                            action: () =>
                            {
                                let e = {currentTarget: {dataset: {modal:"calculate"}}}
                                goToModal(e)
                            }
                        },
                        {
                            title: "Отмена",
                            autoclose: true,
                            mode: "cancel",
                        },
                    ]}
                    actionsLayout="vertical"
                    onClose={()=>setPopout(null)}
                    header="Калькулятор калорий"
                    text="Для формирования рациона питания вам нужно сначала воспользоваться калькулятором Ккал."
                />)
            }else {
                setSelectedEatPlan(c)
                goEat();
            }
        })
    }
    const addToFavorite = (e) =>{
        let type = e.currentTarget.dataset.type;
        if(!favorites){
            let obj = [
                {but:type}
            ]
            setFavorites([...obj])
        }else{
            let oldFav = [...favorites];
            if(oldFav.find(x=>x.but === type)){
                oldFav.splice(oldFav.indexOf(oldFav.find(x=>x.but === type)),1)
                setFavorites([...oldFav])
            }else{
                oldFav.push({but:type})
                setFavorites([...oldFav])
            }
        }
    }
    return (
        <Panel id={id}>
            <PanelHeader>Питание</PanelHeader>
            <div className={"trains_but"}>
                <CellButton data-type={"pox"} data-modal={"days"} onClick={click} centered>Похудеть</CellButton>
                <IconButton data-type={"pox"} onClick={addToFavorite} >
                    {favorites && favorites.find(x=>x.but === "pox") ?
                        <Icon28Favorite  fill={"var(--accent)"}/>
                        :
                        <Icon28FavoriteOutline fill={"var(--accent)"}/>

                    }
                </IconButton>
            </div>
            <div className={"trains_but"}>
                <CellButton data-type={"pod"} data-modal={"days"} onClick={click} centered>Поддержать вес</CellButton>
                <IconButton data-type={"pod"} onClick={addToFavorite}>
                    {favorites && favorites.find(x=>x.but === "pod") ?
                        <Icon28Favorite  fill={"var(--accent)"}/>
                        :
                        <Icon28FavoriteOutline fill={"var(--accent)"}/>

                    }
                </IconButton>
            </div>
            <div className={"trains_but"}>
                <CellButton data-type={"nab"} data-modal={"days"} onClick={click} centered>Набрать массу</CellButton>
                <IconButton data-type={"nab"} onClick={addToFavorite}>
                    {favorites && favorites.find(x=>x.but === "nab") ?
                        <Icon28Favorite  fill={"var(--accent)"}/>
                        :
                        <Icon28FavoriteOutline fill={"var(--accent)"}/>

                    }
                </IconButton>
            </div>

        </Panel>
    )
};

export default Eat;
