import React, {useState, useEffect, useRef} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, ScreenSpinner, AdaptivityProvider, AppRoot, Epic, Tabbar, TabbarItem, Panel} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Trainings from './panels/Trainings';
import {Icon28AppleOutline} from '@vkontakte/icons';
import {Icon28SneakerOutline} from '@vkontakte/icons';
import {Icon28FavoriteOutline} from '@vkontakte/icons';
import {Icon28Profile} from '@vkontakte/icons';
import Eat from "./panels/Eat";
import Favorite from "./panels/Favorite";
import Profile from "./panels/Profile";
import Api from "./components/Api";
import "./css/main.css"
import Modal from "./components/Modal";
import {act} from "react-dom/test-utils";
import Exercises from "./panels/Exercises";
import Dishes from "./panels/Dishes";
const App = () => {
    const [activePanel, setActivePanel] = useState('main');
    const [fetchedUser, setUser] = useState(null);
    const fetchedUserRef = useRef();
    fetchedUserRef.current = fetchedUser;
    const [activeModal, setActiveModal] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);
    const [activeStory, setActiveStory] = useState("trainings");
    const [selectedType,setSelectedType] = useState(null)
    const [selectedPlan,setSelectedPlan] = useState(null)
    const [plans,setPlans] = useState(null)
    const [detectedFavorite,setDetectFavoite] = useState(null)
    const [favorites,setFavorites] = useState(null)
    const [workout,setWorkout] = useState(null)
    const [selectedDishes,setSelectedDishes] = useState(null)

    const [selectedLevel,setSelectedLevel] = useState(null)
    const [selectPlan,setSelectPlan] = useState(null)
    const [selectedEatPlan,setSelectedEatPlan] = useState(null)
    const goEatPlan = (e) =>{
        setActivePanel("dishes")
    }
    const goToExercises = (e) =>{
        let plan = {
            name:e.currentTarget.dataset.name,
            id:e.currentTarget.dataset.plan,
        }
        setActiveModal(null)
        setSelectPlan({...plan})
        setActivePanel("exercises")
    }

    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                const schemeAttribute = document.createAttribute('scheme');
                schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
                document.body.attributes.setNamedItem(schemeAttribute);
            }
        });

        async function fetchData() {
            let user = await bridge.send('VKWebAppGetUserInfo');
            let favorite_button = await bridge.send("VKWebAppStorageGet", {"keys": ["favorites"]});
            if(favorite_button.keys[0].value) {
                favorite_button = JSON.parse(favorite_button.keys[0].value)
                setFavorites(favorite_button)
            }
            user = await Api.initUser(user)
            setUser(user.data);
            setPopout(null);
        }

        fetchData();
    }, []);

    const go = e => {
        setActivePanel(e.currentTarget.dataset.to);
    };
    const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);
    const goToModal = (e) => {
        let type = e.currentTarget.dataset.type;
        let plan = e.currentTarget.dataset.plan;
        let forcelevel = e.currentTarget.dataset.forcelevel;
        type = forcelevel ? forcelevel : type;
        if(type){
            setSelectedType(type)
            if(type === "easy" || type === "medium" || type === "hard"){
                setSelectedLevel(type)
                Api.getPlans(type).then((r)=>{
                    setPlans(r.data.plans)
                })
            }
        }
        if(plan){
            setSelectedPlan(plan)
        }
        setActiveModal(null)
        setActiveModal(e.currentTarget.dataset.modal)
    }

    useEffect(()=>{
       if(favorites){
           bridge.send("VKWebAppStorageSet", {
               key: "favorites",
               value: JSON.stringify(
                  favorites
               )
           });
       }
    },[favorites])
    const selectDay = (e) =>{
        let d = e.currentTarget.dataset.day;
        let zxc = selectedType;
        if(activeStory === "eat" || detectedFavorite){
            if(zxc){
                setActiveModal(null)
                setPopout(<ScreenSpinner/>)
                bridge.send("VKWebAppStorageGet", {"keys": ["calculate"]}).then(r=>{
                    if(r.keys[0].value) {
                        let rd = JSON.parse(r.keys[0].value);
                        if(zxc === "pox"){
                            Api.getProduct(rd.kkallForPoxud,d,fetchedUserRef.current._id,1).then(r=>{
                                setPopout(null)
                                setSelectedDishes(r.data)
                                setActiveModal("dishes")
                            })
                        }else if("pod"){
                            Api.getProduct(rd.kkall,d,fetchedUserRef.current._id,0).then(r=>{
                                setPopout(null)
                                setSelectedDishes(r.data)
                                setActiveModal("dishes")
                            })
                        }else{
                            Api.getProduct(rd.kkallForNabor,d,fetchedUserRef.current._id,-1).then(r=>{
                                setPopout(null)
                                setSelectedDishes(r.data)
                                setActiveModal("dishes")
                            })
                        }
                    }
                })
            }
        }else{
            if(zxc){
                setActiveModal(null)
                setPopout(<ScreenSpinner/>)
                //easy pn 624cb061c608aba01999c0bd = level - day - plan_id
                Api.getWorkout(zxc,d,selectedPlan).then(r=>{
                    setSelectedPlan(null)
                    setWorkout(r.data.works)
                    setPopout(null)
                    setActiveModal("workout")
                })
            }
        }
    }

    useEffect(()=>{
        if(activeStory !== "eat"){
            setDetectFavoite(false)
        }
    },[activeStory])
    return (
        <AdaptivityProvider>
            <AppRoot>
                <View modal={<Modal goExe={goToExercises} favorites={favorites} setFavorites={setFavorites} selectedDishes={selectedDishes} selectedType={selectedType} workout={workout} plans={plans} selectDay={selectDay} bridge={bridge} setActiveModal={setActiveModal} goToModal={goToModal} activeModal={activeModal}/>} activePanel={activePanel} popout={popout}>
                    <Panel id={"main"}>
                        <Epic
                            activeStory={activeStory}
                            tabbar={
                                <Tabbar>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === "trainings"}
                                        data-story="trainings"
                                        text="Тренировки"
                                    >
                                        <Icon28SneakerOutline/>
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === "eat"}
                                        data-story="eat"
                                        text="Питание"
                                    >
                                        <Icon28AppleOutline/>
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === "favorite"}
                                        data-story="favorite"
                                        label={favorites ? `${favorites.length === 0 ? "" : favorites.length}` :""}
                                        text={"Избранное"}
                                    >
                                        <Icon28FavoriteOutline/>
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === "profile"}
                                        data-story="profile"
                                        text="Профиль"
                                    >
                                        <Icon28Profile/>
                                    </TabbarItem>
                                </Tabbar>
                            }
                        >
                            <Trainings goToexerc={goToExercises} goToModal={goToModal} id={'trainings'} go={go}/>
                            <Eat setSelectedEatPlan={setSelectedEatPlan} goEat={goEatPlan} setFavorites={setFavorites} favorites={favorites} bridge={bridge} setPopout={setPopout} goToModal={goToModal} id={'eat'} go={go}/>
                            <Favorite setSelectedEatPlan={setSelectedEatPlan} setSelectedLevel={setSelectedLevel} goEat={goEatPlan}  goToExe={goToExercises} fetchedUser={fetchedUser} goToDishes={goEatPlan} setDetectFavoite={setDetectFavoite} setPopout={setPopout} bridge={bridge} favorites={favorites} setFavorites={setFavorites} goToModal={goToModal} id={'favorite'} go={go}/>
                            <Profile goToModal={goToModal} fetchedUser={fetchedUser} id={'profile'} go={go}/>
                        </Epic>
                    </Panel>
                    <Dishes bridge={bridge} fetchedUser={fetchedUser} type={selectedEatPlan} id={"dishes"} go={go}/>
                    <Exercises selectedPlan={selectPlan} selectedLevel={selectedLevel} id={"exercises"} type={selectedType} go={go}/>
                </View>
            </AppRoot>
        </AdaptivityProvider>
    );
}

export default App;
