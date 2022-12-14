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
    FormItem, Select, Input, Button, Alert, Spinner
} from "@vkontakte/vkui"
import {Icon24Dismiss} from "@vkontakte/icons"

const Calculate = ({id,bridge, onClose}) => {
    const {viewWidth} = useAdaptivity();
    const [selectedGender,setSelectedGender] = useState("-5")
    const [age,setAge] = useState(null)
    const [height,setHeight] = useState(null)
    const [weight,setWeight] = useState(null)
    const [error,setError] = useState(true)
    const [activity,setActivity] = useState("1.2")
    const [result,setResult] = useState(null)
    const platform = usePlatform();
    const getCalculate = () =>{
        let kkall = ((weight*10)+(height*6.25) - (age*5) - selectedGender) * activity;
        let kkallForPoxud = kkall - (kkall * (20/100))
        let kkallForNabor = kkall + (kkall * (20/100))
        bridge.send("VKWebAppStorageSet", {
            key: "calculate",
            value: JSON.stringify({
                kkall,
                kkallForPoxud,
                kkallForNabor
            })
        });
    }
    useEffect(()=>{
        bridge.send("VKWebAppStorageGet", {"keys": ["calculate"]}).then(r=>{
            console.log(r)
            if(!r.keys[0].value){
               setResult(false)
            }else
                setResult(JSON.parse(r.keys[0].value))
        })
    })
    useEffect(()=>{
        if(age && selectedGender && height && weight && activity)
            setError(false)
        else setError(true)
    },[age,selectedGender,height,weight,activity])
    return (
        <ModalPage
            id={id}
            settlingHeight={100}
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
                    ?????????????????????? ????????????????
                </ModalPageHeader>
            }
        >
            {result === false &&
            <Div>
                <FormItem top="??????">
                    <Select
                        options={[{
                            label: "??????????????",
                            value: "-5",
                        },
                            {
                                label: "??????????????",
                                value: "161",
                            }
                        ]}
                        onChange={(e)=>setSelectedGender(e.currentTarget.value)}
                        value={selectedGender}
                    />
                </FormItem>
                <FormItem top="??????????????">
                    <Input
                        type={"number"}
                        onChange={(e)=>setAge(e.currentTarget.value)}
                        value={age}
                    />
                </FormItem>
                <FormItem top="???????? (????.)">
                    <Input
                        type={"number"}
                        onChange={(e)=>setHeight(e.currentTarget.value)}
                        value={height}
                    />
                </FormItem>
                <FormItem top="??????">
                    <Input
                        type={"number"}
                        onChange={(e)=>setWeight(e.currentTarget.value)}
                        value={weight}
                    />
                </FormItem>
                <FormItem top="?????????????????????? ????????????????????">
                    <Select
                        options={[{
                            label: "?????????????????????? ?????? ????????????????????",
                            value: "1.2",
                        },
                            {
                                label: "??????????????????, 3 ???????? ?? ????????????",
                                value: "1.38",
                            },
                            {
                                label: "?????????????? ????????????????????????, 5 ?????? ?? ????????????",
                                value: "1.46",
                            },
                            {
                                label: "????????????????????, 5 ?????? ?? ????????????",
                                value: "1.55",
                            },
                            {
                                label: "???????????????????????? ????????????????????",
                                value: "1.64",
                            },
                            {
                                label: "?????????????????????? ???????????????????? ???????????? ????????",
                                value: "1.73",
                            },
                            {
                                label: "???????????????????? ??????.???????????????? + ???????????????????? ????????????",
                                value: "1.9",
                            }
                        ]}
                        onChange={(e)=>setSelectedGender(e.currentTarget.value)}
                        value={selectedGender}
                    />
                </FormItem>

                <FormItem top={error ? <span style={{color: "red",width:"100%"}}>?????????????????? ?????? ????????</span>:null}>
                    <Button disabled={error} onClick={getCalculate} size={"l"} mode={"commerce"} stretched>????????????????????</Button>

                </FormItem>
            </Div>
            }
            {result !== null && result !== false &&
                <Div>
                    1
                </Div>
            }
            {result === null &&
                <Spinner/>
            }
        </ModalPage>
    )
}
export default Calculate