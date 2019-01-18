
class Pattern {
    constructor() {
        this.conditions = null
        this.CurrentPattern = null
    }
    RegisterOnReady() {
        $($.proxy(this.onReady, this))
    }
    onReady() {
        this.LoadConditions()
        $(".condition").show()
        $("#Pattern").on("change", () => this.onChangePatern())
        $("#CurrentPattern").on("change", ".then-color", (e) => this.onChangeColor(e))
        $("#CurrentPattern").on("change", ".then-direction", (e) => this.onChangeDirection(e))
        
        console.log("Pattern.onReady")
    }
    get BoardPattern(){
        return $("#CurrentPattern > tbody > tr")
    }
    
    onChangeColor(e){
        $(e.currentTarget).parent().nextAll('tr').each((i, e) => {
            $(e).remove()
        })
        let prevColors = []
        $(e.currentTarget).parent().prevAll('tr').each((i, e) => {
             prevColors.push($(e).children(".then-color").children("select").val())
        })
        let color = $(e.currentTarget).children("select").val()

        if (prevColors.includes(color)){
            $(e.currentTarget).children("select").val("#FFFFFF")
            alert("Cette Couleur existe deja!")
            $(this).trigger("change")
            return
        }
        if ( color !== "#FFFFFF"){
            let newStep = {if: color ,
            then: {
                color: "#FFFFFF",
                direction: "left"
            }}
            $("#CurrentPattern").append(Pattern.GetHtmlRow(newStep))
        }
        $(this).trigger("change")
    }
    onChangeDirection(){
        $(this).trigger("change")
    }
    onChangePatern(){
        this.ShowCurrentPattern()
        $(this).trigger("change")
    }
    ShowCurrentPattern(){
        $("#CurrentPattern").children("tbody").children("tr").remove()
        let name = $("#Pattern").val()
        for (var i = 0;  i < this.conditions.length; i++) { 
            if (this.conditions[i].name == name){
                this.CurrentPattern = this.conditions[i]
                break
            }
        }
        let steps = this.CurrentPattern.steps
        for (var c = 0; c < steps.length; c++){
            $("#CurrentPattern").append(Pattern.GetHtmlRow(steps[c]))
        }
        
    }
    LoadConditions(){
        let onSuccess = $.proxy(function (data, status, xhr) {
           this.conditions = data.patterns
            for (let i = 0;  i < data.patterns.length; i++) { 
               let name = data.patterns[i].name
               $("#Pattern").append("<option value='" + name +"'>" + name+ "</option>")
            }
            this.ShowCurrentPattern()             
        }, this)

        let onError = $.proxy(function (xhr, status, error) {
            console.log(xhr.status + " - " + xhr.statusText)
        }, this)


        let settings = {
            type: 'GET',
            dataType: 'json',
            success: onSuccess,
            error: onError
        }

        $.ajax("https://api.myjson.com/bins/crrrn", settings)
    }
    static GetSelect(json, selected) {
        let html = '<select>'
        for (var property in json) {
            html += '<option value="' + property + '"'
            if (selected === property) {
                html += ' selected="selected"'
            }
            html += '>' + json[property] + '</option>'
        }
        html += '</select>'
        return html
    }
    static GetHtmlRow(step) {
        let settings = $.extend({
            if: "#FFFFFF",
            then: {
                color: "#FFFFFF",
                direction: "left"
            }
        }, step)

        let html = '<tr data-if-color="' + settings.if + '">'
        html += '<td class="if-color">' + PatternColor[settings.if] + '</td>'
        html += '<td class="then-color">' + Pattern.GetSelect(PatternColor, settings.then.color) + '</td>'
        html += '<td class="then-direction">' + Pattern.GetSelect(PatternDirection, settings.then.direction) + '</td>'
        html += '</tr>'
        return html
    }
}

const PatternColor = Object.freeze({
    "#FFFFFF": "Blanc",
    "#6D9ECE": "Bleu Clair",
    "#1F5FA0": "Bleu Fonc&eacute;",
    "#6D071A": "Bordeaux",
    "#606060": "Gris",
    "#F0C300": "Jaune",
    "#000000": "Noir",
    "#FF7F00": "Orange",
    "#E0115F": "Rose",
    "#DB1702": "Rouge",
    "#008020": "Vert",
    "#7F00FF": "Violet"
})

const PatternDirection = Object.freeze({
    "left": "Gauche",
    "right": "Droite"
})
