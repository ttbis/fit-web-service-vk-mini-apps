import React, {useEffect, useState} from "react"
import {
    ANDROID,
    Button,
    Div,
    FormItem,
    Input,
    IOS,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    Subhead,
    PanelHeaderButton,
    PanelHeaderClose,
    Select,
    Spinner,
    Title,
    useAdaptivity,
    usePlatform,
    Header,
    Separator,
    Gradient,
    RichCell,
    Avatar,
    CellButton, IconButton
} from "@vkontakte/vkui"
import Calculate from "../modals/Calculate";
import Days from "../modals/Days";
import Plans from "../modals/Plans";
import {Icon24Dismiss, Icon28Favorite, Icon28FavoriteOutline} from "@vkontakte/icons";

const Modal = ({activeModal,goExe,favorites,setFavorites,selectedDishes,selectedType, workout, plans, bridge, goToModal, selectDay, setActiveModal}) => {
    const {viewWidth} = useAdaptivity();
    const [selectedGender, setSelectedGender] = useState("-5")
    const [age, setAge] = useState(null)
    const [height, setHeight] = useState(null)
    const [weight, setWeight] = useState(null)
    const [error, setError] = useState(true)
    const [activity, setActivity] = useState("1.2")
    const [result, setResult] = useState(null)
    const platform = usePlatform();
    const [oldModal, setOldModal] = useState(null)
    const closeModal = () => {
        if (oldModal && oldModal !== activeModal) {
            setActiveModal(oldModal)
            setOldModal(null)
        } else {
            setActiveModal(null)
            setOldModal(null)
        }

    }
    const getDayOfWeek = (day) =>{
        switch (day){
            case "pn":
                return "Понедельник"
            case "vt":
                return "Вторник"
            case "sr":
                return "Среда"
            case "ch":
                return "Четверг"
            case "pt":
                return "Пятница"
            case "sb":
                return "Суббота"
            case "vs":
                return "Воскресенье"

        }
    }
    const backToModal = () => {
        setOldModal(null)
        setActiveModal(oldModal)
    }
    useEffect(() => {
        if (!oldModal && activeModal)
            setOldModal(activeModal)
    }, [activeModal])

    const getCalculate = () => {
        let kkall = ((weight * 10) + (height * 6.25) - (age * 5) - selectedGender) * activity;
        let kkallForPoxud = kkall - (kkall * (20 / 100))
        let kkallForNabor = kkall + (kkall * (20 / 100))
        bridge.send("VKWebAppStorageSet", {
            key: "calculate",
            value: JSON.stringify({
                kkall,
                kkallForPoxud,
                kkallForNabor
            })
        });
        setResult({
            kkall,
            kkallForPoxud,
            kkallForNabor
        })
    }
    useEffect(() => {
        if (activeModal === "calculate")
            bridge.send("VKWebAppStorageGet", {"keys": ["calculate"]}).then(r => {
                console.log(r)
                if (!r.keys[0].value) {
                    setResult(false)
                } else
                    setResult(JSON.parse(r.keys[0].value))
            })
    }, [activeModal])
    useEffect(() => {
        if (age && selectedGender && height && weight && activity)
            setError(false)
        else setError(true)
    }, [age, selectedGender, height, weight, activity])
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
        <ModalRoot onClose={closeModal} activeModal={activeModal}>
            <ModalPage
                id={"calculate"}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={
                            platform === IOS && (
                                <PanelHeaderButton onClick={closeModal}>
                                    <Icon24Dismiss/>
                                </PanelHeaderButton>
                            )
                        }
                        left={
                            platform === ANDROID && <PanelHeaderClose onClick={closeModal}/>
                        }
                    >
                        Калькулятор каллорий
                    </ModalPageHeader>
                }
            >
                {result === false && result !== null &&
                    <Div>
                        <FormItem top="Пол">
                            <Select
                                options={[{
                                    label: "Мужской",
                                    value: "-5",
                                },
                                    {
                                        label: "Женский",
                                        value: "161",
                                    }
                                ]}
                                onChange={(e) => setSelectedGender(e.currentTarget.value)}
                                value={selectedGender}
                            />
                        </FormItem>
                        <FormItem top="Возраст">
                            <Input
                                type={"number"}
                                onChange={(e) => setAge(e.currentTarget.value)}
                                value={age}
                            />
                        </FormItem>
                        <FormItem top="Рост (см.)">
                            <Input
                                type={"number"}
                                onChange={(e) => setHeight(e.currentTarget.value)}
                                value={height}
                            />
                        </FormItem>
                        <FormItem top="Вес">
                            <Input
                                type={"number"}
                                onChange={(e) => setWeight(e.currentTarget.value)}
                                value={weight}
                            />
                        </FormItem>
                        <FormItem top="Физическкая активность">
                            <Select
                                options={[{
                                    label: "Отсутствует или минимальна",
                                    value: "1.2",
                                },
                                    {
                                        label: "Умеренная, 3 раза в неделю",
                                        value: "1.38",
                                    },
                                    {
                                        label: "Средней интесивности, 5 раз в неделю",
                                        value: "1.46",
                                    },
                                    {
                                        label: "Интесивная, 5 раз в неделю",
                                        value: "1.55",
                                    },
                                    {
                                        label: "Каждодневные тренировки",
                                        value: "1.64",
                                    },
                                    {
                                        label: "Интенсивные тренировки каждый день",
                                        value: "1.73",
                                    },
                                    {
                                        label: "Ежедневная физ.нагрузка + физическая работа",
                                        value: "1.9",
                                    }
                                ]}
                                onChange={(e) => setSelectedGender(e.currentTarget.value)}
                                value={selectedGender}
                            />
                        </FormItem>

                        <FormItem
                            top={error ? <span style={{color: "red", width: "100%"}}>Заполните все поля</span> : null}>
                            <Button disabled={error} onClick={getCalculate} size={"l"} mode={"commerce"}
                                    stretched>Рассчитать</Button>

                        </FormItem>
                    </Div>
                }
                {result !== null && result !== false &&
                    <Div>
                        <Subhead style={{textAlign: "center", marginTop: 10}} weight={"medium"}>
                            Ккал в сутки для похудения: <br/>{result.kkallForPoxud}
                        </Subhead>
                        <Subhead style={{textAlign: "center", marginTop: 10}} weight={"medium"}>
                            Ккал для поддержания формы: <br/>{result.kkall}
                        </Subhead>
                        <Subhead style={{textAlign: "center", marginTop: 10}} weight={"medium"}>
                            Ккал для набора массы: <br/>{result.kkallForNabor}
                        </Subhead>
                        <Button stretched style={{marginTop: 20}} size={"m"} mode={"commerce"}
                                onClick={() => setResult(false)}>Рассчитать снова</Button>
                    </Div>
                }
                {result === null &&
                    <Spinner/>
                }
            </ModalPage>
            <ModalPage
                id={"workout"}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={
                            platform === IOS && (
                                <PanelHeaderButton onClick={closeModal}>
                                    <Icon24Dismiss/>
                                </PanelHeaderButton>
                            )
                        }
                        left={
                            platform === ANDROID && <PanelHeaderClose onClick={closeModal}/>
                        }
                    >
                        Тренировка
                    </ModalPageHeader>
                }
            >
                {(!workout) &&  <Title weight={"medium"} style={{width:"100%",textAlign:"center",paddingBottom:40}} level={"3"}>Пока тут ничего нет </Title>}
                {workout  && <Div>
                    <Title weight={"medium"} style={{width:"100%",textAlign:"center",marginBottom:20}} level={"2"}>{workout.name}</Title>
                    <Separator style={{marginBottom:30}} wide/>
                    <div style={{paddingBottom:50}}>
                        {workout.exercises.map((item,key)=>(
                            <Subhead style={{width:"100%",marginBottom:20,textAlign:"center"}} key={key} weight={"medium"}>
                                {item}
                            </Subhead>
                        ))}
                    </div>

                </Div>}
            </ModalPage>
            <ModalPage
                id={"dishes"}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={
                            platform === IOS && (
                                <PanelHeaderButton onClick={closeModal}>
                                    <Icon24Dismiss/>
                                </PanelHeaderButton>
                            )
                        }
                        left={
                            platform === ANDROID && <PanelHeaderClose onClick={closeModal}/>
                        }
                    >
                        Питание {selectedDishes && selectedDishes.dishes.hasOwnProperty("day") ? `(${getDayOfWeek(selectedDishes.dishes.day)})` : ""}
                    </ModalPageHeader>
                }
            >
                <Div>
                    {selectedDishes && selectedDishes.dishes.dishes.map((item,key)=>{
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
                </Div>
            </ModalPage>
            {/*<Calculate bridge={bridge} id={"calculate"} onClose={closeModal}/>*/}
            <Days selectDay={selectDay} oldModal={oldModal} id={"days"} onClose={closeModal}/>
            {/*<Plans goToExe={goExe} setFavorites={setFavorites} favorites={favorites} selectedType={selectedType} plans={plans} goToModal={goToModal} id={"plans"} onClose={closeModal}/>*/}
            <ModalPage
                id={"plans"}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={
                            platform === IOS && (
                                <PanelHeaderButton onClick={closeModal}>
                                    <Icon24Dismiss/>
                                </PanelHeaderButton>
                            )
                        }
                        left={
                            platform === ANDROID && <PanelHeaderClose onClick={closeModal}/>
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
                                <CellButton className={"trains_but_cell"} data-plan={item._id} data-name={item.name} data-modal={"days"} onClick={goExe} centered>{item.name}</CellButton>
                                <IconButton className={"trains_but_fav"} data-name={item.name} data-id={item._id} onClick={addToFavorite}>
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
        </ModalRoot>
    )
}
export default Modal