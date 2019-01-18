/// <reference path="ant.js" />
/// <reference path="grid.js" />
/// <reference path="pattern.js" />
/// <reference path="simulation.js" />

class Langton {
    constructor() {
        this.Pattern = new Pattern()
        this.Simulation = new Simulation()
    }
    RegisterOnReady() {
        this.Pattern.RegisterOnReady()
        this.Simulation.RegisterOnReady()

        $($.proxy(this.onReady, this))
    }
    onReady() {
        this.Grid = new Grid("Grid", this.Simulation.Size)
        this.Ant = new Ant(this.Grid.MiddleX, this.Grid.MiddleY)
        this.displayAntInfo()

        $(this.Ant).on("move", $.proxy(this.displayAntInfo, this))
        $(this.Simulation).on("reset", (e, data) => this.ResetSimulation(data) )
        $(this.Simulation).on("moveByStep", (e, data) => this.MoveByStep(data, this.Pattern.CurrentPattern ))
        $(this.Pattern).on("change", () => this.Simulation.onResetBtn())

        
        
        console.log("Langton.onReady")
    }
    ResetSimulation(size){
        this.Grid.Size = size
        this.Ant.Reset(this.Grid.MiddleX, this.Grid.MiddleY)
    }
    MoveByStep(step, pattern){
        if (step === 0 || this.Grid.IsOutside(this.Ant.X, this.Ant.Y)){
            return
        }     
        this.ApplyBoardPattern(this.Ant.X, this.Ant.Y)
        this.MoveByStep(step - 1, pattern )
    }
    ApplyJsonPattern(pattern, x, y){
        for (let i = 0; i < pattern.steps.length; i++){
            if( pattern.steps[i].if == this.Grid.GetColor(x, y)){
                this.Grid.SetColor(x, y, pattern.steps[i].then.color)
                this.Ant.Turn(pattern.steps[i].then.direction)
                break
            }
        }
    }
    ApplyBoardPattern(x, y){
        let patt = this.Pattern.BoardPattern
        let color = this.Grid.GetColor(x, y)
        $(patt).each((i, e) => {
            if ( $(e).data("if-color") === color){
                let col = $(e).children(".then-color").children("select").val()
                let dir = $(e).children(".then-direction").children("select").val()
                this.Grid.SetColor(x, y, col)
                this.Ant.Turn(dir)
                return false
            }
        } )
    }
    static BasicPattern(){
        return {"name":"Simple","steps":[{"if":"#FFFFFF","then":{"color":"#000000","direction":"right"}},{"if":"#000000","then":{"color":"#FFFFFF","direction":"left"}}]}
    }
    displayAntInfo() {
        
        this.Grid.SetColor(this.Ant.X, this.Ant.Y, Ant.Color)
        $(".ant-x").text(this.Ant.X)
        $(".ant-y").text(this.Ant.Y)
        $(".ant-direction").text(this.Ant.Direction)
        $(".ant-nb-steps").text(this.Ant.NbSteps)
        
    }
    
}


let langton = new Langton()
langton.RegisterOnReady()
