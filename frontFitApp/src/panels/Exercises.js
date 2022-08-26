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
    ScreenSpinner, Subhead, Header
} from "@vkontakte/vkui";
import DaysTabs from "../components/DaysTabs";
import Api from "../components/Api";


const Exercises = ({id,selectedLevel,selectedPlan,type,go}) =>{
    const [activeTab,setActiveTab] = useState("pn")
    const [popout,setPopout] = useState(null);
    const [viewMap,setViewMap] = useState(null)
    const [map,setMap] = useState(null)
    useEffect(()=>{
        if(selectedLevel && selectedPlan){
            //easy pn 624cb061c608aba01999c0bd = level - day - plan_id
            setPopout(<ScreenSpinner/>)
            Api.getWorkout(selectedLevel,activeTab,selectedPlan.id).then(r=>{
                console.log(r.data.works)
                setMap(r.data.works)
                setPopout(null)
            })
        }
    },[selectedLevel,selectedPlan])
    useEffect(()=>{
        if(activeTab && map){
            let d = map.find(x=>x.day === activeTab);
            setViewMap({...d})
        }
    },[activeTab,map])
    return (
        <View popout={popout} activePanel={id} id={id}>
            <Panel id={id}>
                <PanelHeader left={<PanelHeaderBack onClick={go} data-to={"main"} />}>
                   {selectedPlan && selectedPlan.name} - {selectedLevel && selectedLevel === "easy" ? "Новичек" : selectedLevel === "medium" ? "Опытный" : selectedLevel === "hard" ? "Мастер" : "" }
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
                    {viewMap && viewMap.exercises && viewMap.exercises.map((item,key)=>(
                        <Subhead style={{width:"100%",marginBottom:20,textAlign:"center"}} key={key} weight={"medium"}>
                            {item}
                        </Subhead>
                    ))}
                    {!viewMap || !viewMap.exercises &&
                        <Subhead style={{width:"100%",textAlign:"center"}} weight={"medium"}>Пока тут пусто</Subhead>
                    }
                </Div>
            </Panel>
        </View>

    )
}
export default Exercises;