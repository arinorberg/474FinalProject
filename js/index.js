// layout based on: http://blockbuilder.org/Jverma/076377dd0125b1a508621441752735fc
var margin = {top: 40, right: 50, bottom: 40, left:50};
var width = +700 - margin.left - margin.right;
var height = +575 - margin.top - margin.bottom;
var svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

 var currentBAC;

 // ask bout themself
 var gender;
 var weight;
 var hours;

 // ask them bout their drink
 var numDrinks;
 var oz;
 var percentage;

 function alcoholContent(num, oz, percentage) {
     var alc = num * oz * percentage;
     return alc;
 }

 var alcohol = alcoholContent(numDrinks, oz, percentage);

 function BACcalculator(W, H, G, A) {
   var r;
   if (G === 'female') {
     r = .66;
   }
   else {
     r = .73;
   }
   var BAC = ((A * 5.14 )/ (W * r) - (0.015 * H));
   return BAC;
 }

 weight = 170;
 hours = 4.5;
 alcohol = alcoholContent(7, 12, 0.05);
 gender = "male";
 console.log("alcohol: " + alcohol);
 currentBAC = BACcalculator(weight, hours, gender, alcohol);
 console.log(currentBAC);

//var drunkness = d3.circle();




 var effects;

 if (currentBAC < .02) {
   effects = "not significant effects"
 } else if (currentBAC < .03){
     effects = "No loss of coordination, slight euphoria and loss of shyness. Depressant effects are not apparent. Mildly relaxed and maybe a little lightheaded."
 } else if (currentBAC < .06){
       effects = "Feeling of well-being, relaxation, lower inhibitions, sensation of warmth. Euphoria. Some minor impairment of reasoning and memory, lowering of caution. Your behavior may become exaggerated and emotions intensified (Good emotions are better, bad emotions are worse)"

 } else if (currentBAC < .09){
     effects = "Slight impairment of balance, speech, vision, reaction time, and hearing. Euphoria. Judgment and self-control are reduced, and caution, reason and memory are impaired, .08 is legally impaired and it is illegal to drive at this level. You will probably believe that you are functioning better than you really are."

 } else if (currentBAC < .125){
     effects = "Significant impairment of motor coordination and loss of good judgment. Speech may be slurred; balance, vision, reaction time and hearing will be impaired. Euphoria."

 } else if (currentBAC < .15){
     effects = "Gross motor impairment and lack of physical control. Blurred vision and major loss of balance. Euphoria is reduced and dysphoria (anxiety, restlessness) is beginning to appear. Judgment and perception are severely impaired."

 } else if (currentBAC < .19){
     effects = "Dysphoria predominates, nausea may appear. The drinker has the appearance of a \"sloppy drunk.\""

 } else if (currentBAC < .20){
     effects = "Felling dazed, confused or otherwise disoriented. May need help to stand or walk. If you injure yourself you may not feel the pain. Some people experience nausea and vomiting at this level. The gag reflex is impaired and you can choke if you do vomit. Blackouts are likely at this level so you may not remember what has happened."

   } else if (currentBAC < .25){
       effects = "All mental, physical and sensory functions are severely impaired. Increased risk of asphyxiation from choking on vomit and of seriously injuring yourself by falls or other accidents."

   } else if (currentBAC < .30){
       effects = "STUPOR. You have little comprehension of where you are. You may pass out suddenly and be difficult to awaken."

   } else if (currentBAC < .40){
       effects = "Coma is possible. This is the level of surgical anesthesia. "

   }
     












