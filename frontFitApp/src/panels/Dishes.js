import React, {useEffect, useState} from "react"
import {
    Panel,
    Div,
    PanelHeader,
    Tabs,
    HorizontalScroll,
    TabsItem,
    PanelHeaderBack,
    View,
    Group,
    ScreenSpinner, Subhead, Header, Gradient, RichCell, Avatar, Separator
} from "@vkontakte/vkui";
import DaysTabs from "../components/DaysTabs";
import Api from "../components/Api";
import bridge from "@vkontakte/vk-bridge";


const Dishes = ({id,type,bridge,fetchedUser,go}) =>{
    const [activeTab,setActiveTab] = useState("pn")
    const [popout,setPopout] = useState(null);
    const [viewMap,setViewMap] = useState(null)
    const [map,setMap] = useState(null)
    const [kkall,setKkall] = useState(null)
    useEffect(()=>{
        if(type){
            setPopout(<ScreenSpinner/>)
            bridge.send("VKWebAppStorageGet", {"keys": ["calculate"]}).then(r=>{
                if(r.keys[0].value) {
                    let ad=  JSON.parse(r.keys[0].value);
                    setKkall({...ad})
                }
                setPopout(null)
            })
        }
    },[type])
    useEffect(()=>{

        if(activeTab && kkall){
            setPopout(<ScreenSpinner/>)
            if(type === "pox"){
                Api.getProduct(kkall.kkallForPoxud,activeTab,fetchedUser._id,1).then(r=>{
                    setPopout(null)
                    setViewMap({...r.data})
                })
            }else if(type === "pod"){
                Api.getProduct(kkall.kkall,activeTab,fetchedUser.id,0).then(r=>{
                    setPopout(null)
                    setViewMap({...r.data})
                })
            }else{
                Api.getProduct(kkall.kkallForNabor,activeTab,fetchedUser.id,-1).then(r=>{
                    setPopout(null)
                    setViewMap({...r.data})
                })
            }
        }
    },[activeTab,kkall])

    return (
        <View popout={popout} activePanel={id} id={id}>
            <Panel id={id}>
                <PanelHeader left={<PanelHeaderBack onClick={go} data-to={"main"} />}>
                   Питание - {type === "pox" ? "Похудение" : type === "pod" ? "Поддержание" : "Набор"}
                </PanelHeader>
                <Group>
                    <HorizontalScroll
                        showArrows
                        getScrollToLeft={(i) => i - 120}
                        getScrollToRight={(i) => i + 120}
                    >
                        <DaysTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
                    </HorizontalScroll>
                </Group>
                <Div>
                    {viewMap && viewMap.dishes.dishes.map((item,key)=>{
                        let dinner_day = key === 0 ? "Завтрак" : key === 1 ? "Обед" : "Ужин"
                        return (
                            <Gradient
                                style={{

                                }}
                            >
                                {item.kkall === 0 ?
                                    <RichCell
                                        disabled
                                        text={"Пропустить"}
                                        caption={""}
                                    >
                                        {dinner_day}
                                    </RichCell>
                                    :
                                    <RichCell
                                        disabled
                                        multiline
                                        before={<Avatar size={72} src={item.photo} />}
                                        text={`${item.name} - ${item.kkall} ккалл`}
                                        caption={
                                            <div style={{wordWrap:"break-word"}}>
                                                <div dangerouslySetInnerHTML={{__html:item.reception.products}}/>
                                                <Separator wide style={{marginTop:5,marginBottom:5}}/>
                                                <div style={{color:"var(--accent)",fontSize:15}} dangerouslySetInnerHTML={{__html:item.reception.text}}/>

                                            </div>
                                        }
                                    >
                                        {dinner_day}
                                    </RichCell>
                                }

                            </Gradient>
                        )
                    })}
                    {!viewMap || !viewMap.dishes &&
                        <Subhead style={{width:"100%",textAlign:"center"}} weight={"medium"}>Пока тут пусто</Subhead>
                    }
                </Div>
            </Panel>
        </View>

    )
}
export default Dishes;