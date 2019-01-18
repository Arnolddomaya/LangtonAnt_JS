
class Simulation {
    constructor() {
        this.StepTiming = null
    }
    RegisterOnReady() {
        $($.proxy(this.onReady, this))
    }
    onReady() {
        $("#Reset").on("click", () => this.onResetBtn())
        $("#MoveForward").on("click", () => this.onMoveForwardBtn())
        $("#Start").on("click", (e) => this.onStartStopBtn(e))
        $("#Interval").on("change", (e) => this.onChangeInterval(e)) // Prise en compte du changement d'intervalle pendant le running

        $("input:radio[name='size']").on("change", () => this.onResetBtn())

        console.log("Simulation.onReady")
    }
    get Size() {
        return parseInt($("input:radio[name='size']:checked").val())
    }
    onStartStopBtn(e){
        if ($(e.currentTarget).hasClass("running")){
            this.StopRunning()
        }
        else{
            this.StartRunning()
        }
    }
    onMoveForwardBtn(){           
        this.MoveByStep()
    }
    onResetBtn(){
        $(this).trigger("reset", this.Size)
        if ($("#Start").hasClass("running")){
            this.StopRunning()
        }
    }
    onChangeInterval(e){
        if ($("#Start").hasClass("running")){
            let inter = parseInt($("#Interval").val())
            this.SetInterval(inter)
        } 
    }
    StopRunning(){
        
        clearInterval(this.StepTiming);
        $("#Start").removeClass('running').html("D&eacute;marrer")
    }
    StartRunning(){
        let delay = parseInt($("#Interval").val())
        this.StepTiming = setInterval(() => this.MoveByStep(), delay)
        $("#Start").html("Arr&ecirc;ter").addClass('running')
    }
    MoveByStep(){
        let step = parseInt($("#NbSteps").val())
        if (isNaN(step)){
            alert("Entrez le nombre de step.")
            return
        }
        $(this).trigger("moveByStep", step)
    }
    
    SetInterval(val){
        clearInterval(this.StepTiming)
        this.StepTiming = setInterval(() => this.MoveByStep(), val)
    }   
}
