const user = {
  state: {
      userMsg:{},
      identity: {}
  },
  mutations: {
      setUserMsg(state:any,payload:any){
        state.userMsg = payload
      },
      setIdentity(state:any,payload:any){
        state.identity = payload
      }
  },
  actions: {
      aSetUserMsg(context:any,payload:any){
        context.commit('setUserMsg',payload)
      },
      aSetIdentity(context:any,payload:any){
        context.commit('setIdentity',payload)

      }
  },
  
}
export default user