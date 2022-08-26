import http from "./http";

class Api {
    initUser(user){
        return http.post("/api", {t_:"initUser",user});
    }
    getProduct(kkall,day,id,type){
        return http.post("/api", {t_:"getProducts",kkall,day,id,type})
    }
    getWorkout(level,day,plan_id){
        return http.post("/api", {t_:"getWorkout",level,day,plan_id})
    }
    getWorks(level){
        return http.post("/api", {t_:"getWorkouts",level})
    }
    getPlans(){
        return http.post("/api", {t_:"getPlans"})
    }
}
export default new Api();