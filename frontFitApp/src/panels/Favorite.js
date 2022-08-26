import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {
    Panel,
    PanelHeader,
    Header,
    Button,
    Group,
    Cell,
    Div,
    Avatar,
    Placeholder,
    CellButton,
    IconButton, Alert, ScreenSpinner, Tabs, TabsItem
} from '@vkontakte/vkui';
import {Icon28Favorite, Icon28FavoriteOutline} from "@vkontakte/icons";
import { Icon28InboxOutline } from '@vkontakte/icons';
const Favorite = ({id,goToExe,goEat,setSelectedEatPlan,setSelectedLevel,goToDishes,setDetectFavoite, favorites, setPopout, bridge, goToModal, setFavorites, go, fetchedUser}) => {
    const [activeTab,setActiveTab] = useState("train")
    const click = (e) => {
        setPopout(<ScreenSpinner/>)
        setDetectFavoite(true)
        let c = e.currentTarget.dataset.type;
        bridge.send("VKWebAppStorageGet", {"keys": ["calculate"]}).then(r => {
            setPopout(null)
            if (!r.keys[0].value) {
                setPopout(<Alert
                    actions={[
                        {
                            title: "Рассчитать",
                            mode: "commerce",
                            autoclose: true,
                            action: () => {
                                let e = {currentTarget: {dataset: {modal: "calculate"}}}
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
                    onClose={() => setPopout(null)}
                    header="Калькулятор калорий"
                    text="Для формирования рациона питания вам нужно сначала воспользоваться калькулятором Ккал."
                />)
            } else {
                setSelectedEatPlan(c)
                goEat();
            }
        })
    }
    const addToFavorite = (e) => {
        let id = e.currentTarget.dataset.id;
        let type = e.currentTarget.dataset.type;
        let name = e.currentTarget.dataset.namee;
        if (id) {
            let oldFav = [...favorites];
            if(oldFav.find(x=>x.id === id)) {
                oldFav.splice(oldFav.indexOf(oldFav.find(x => x.id === id)), 1)
                setFavorites([...oldFav])
            }
        }else{
            let oldFav = [...favorites];
            if(oldFav.find(x=>x.but === type)){
                oldFav.splice(oldFav.indexOf(oldFav.find(x=>x.but === type)),1)
                setFavorites([...oldFav])
            }
        }

    }
    return (
        <Panel id={id}>
            <PanelHeader>Избранное</PanelHeader>
            <Tabs>
                <TabsItem
                    onClick={() => {
                        if(activeTab !== "train")
                            setActiveTab("train")
                    }}
                    selected={activeTab === "train"}
                >
                    Тренировки
                </TabsItem>
                <TabsItem
                    onClick={() => {
                        if(activeTab !== "eat")
                            setActiveTab("eat")
                    }}
                    selected={activeTab === "eat"}
                >
                    Питание
                </TabsItem>
            </Tabs>
            {!favorites ?
                <Placeholder icon={<Icon28InboxOutline />}>
                    Пока тут ничего нет.
                </Placeholder>
                :
                favorites.map((item, key) => {
                    if (!item.hasOwnProperty("name_") && activeTab === "eat")
                        return (
                            <div key={key} className={"trains_but"}>
                                <CellButton data-type={item.but} data-modal={"days"} onClick={click} centered>
                                    {item.but === "pox" ?
                                        "Похудеть" :
                                        item.but === "pod" ?
                                            "Поддержать вес" : "Набрать массу"

                                    }
                                </CellButton>
                                <IconButton data-type={item.but} onClick={addToFavorite}>
                                    <Icon28Favorite fill={"var(--accent)"}/>
                                </IconButton>
                            </div>
                        )
                    else if(activeTab === "train" && item.hasOwnProperty("name_"))
                        return (
                            <div key={key} className={"trains_but"}>
                                <CellButton className={"trains_but_cell_fav"} data-name={item.name_} data-plan={item.id} data-forcelevel={item.selectedType} data-modal={"days"} onClick={(e)=> {
                                    setDetectFavoite(false)
                                    setSelectedLevel(item.selectedType)
                                    goToExe(e)
                                }}
                                            centered>
                                    {item.name_}
                                    ({item.selectedType && item.selectedType === "easy" ? "Новичек" : item.selectedType === "medium" ? "Опытный" : item.selectedType === "hard" ? "Мастер" : "" })
                                </CellButton>
                                <IconButton data-namee={item.name_} data-id={item.id} onClick={addToFavorite}>
                                    <Icon28Favorite fill={"var(--accent)"}/>
                                </IconButton>
                            </div>
                        )
                })

            }
        </Panel>
    )
};

export default Favorite;
