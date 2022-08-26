import React from "react"
import {Tabs, TabsItem} from "@vkontakte/vkui";

const DaysTabs = ({activeTab,setActiveTab}) =>(
    <Tabs>
        <TabsItem
            onClick={() => {
                if(activeTab !== "pn")
                    setActiveTab("pn")
            }}
            selected={activeTab === "pn"}
        >
            Понедельник
        </TabsItem>
        <TabsItem
            onClick={() => {
                if(activeTab !== "vt")
                    setActiveTab("vt")
            }}
            selected={activeTab === "vt"}
        >
            Вторник
        </TabsItem>
        <TabsItem
            onClick={() => {
                if(activeTab !== "sr")
                    setActiveTab("sr")
            }}
            selected={activeTab === "sr"}
        >
            Среда
        </TabsItem>
        <TabsItem
            onClick={() => {
                if(activeTab !== "ch")
                    setActiveTab("ch")
            }}
            selected={activeTab === "ch"}
        >
            Четверг
        </TabsItem>
        <TabsItem
            onClick={() => {
                if(activeTab !== "pt")
                    setActiveTab("pt")
            }}
            selected={activeTab === "pt"}
        >
            Пятница
        </TabsItem>
        <TabsItem
            onClick={() => {
                if(activeTab !== "sb")
                    setActiveTab("sb")
            }}
            selected={activeTab === "sb"}
        >
            Суббота
        </TabsItem>
        <TabsItem
            onClick={() => {
                if(activeTab !== "vs")
                    setActiveTab("vs")
            }}
            selected={activeTab === "vs"}
        >
            Воскресенье
        </TabsItem>
    </Tabs>
)
export default DaysTabs