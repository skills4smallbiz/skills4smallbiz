
function intersection(a1, a2){
    a1.filter(value => a2.includes(value))
    return a1
}

function reportEvents(events){
    events.forEach(element => {
       document.getElementById(element.ID).addEventListener(element.eventType, ()=>{
            gtag('event', element.action, {'event_category': element.category,'event_label': element.event_label,'value': element.value});    
            console.log("Analytics Log:", element.action)
        
        }) 
    });
}
