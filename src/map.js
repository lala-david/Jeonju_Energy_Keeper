var mapContainer = document.getElementById('map');

var mapOption = {
    center: new kakao.maps.LatLng(35.824018302883686, 127.14790719550994),
    level: 10
};

var map = new kakao.maps.Map(mapContainer, mapOption);

 
var infowindow = new kakao.maps.InfoWindow({removable: true});

// dong.json 파일 로드
fetch('./json/dong.json')
.then(response => response.json())
.then(areas => {
    for (var i = 0, len = areas.length; i < len; i++) {
        displayArea(areas[i]);
    }
});

function displayArea(area) {

    var path = area.path.map(function(coord) {
        return new kakao.maps.LatLng(coord[1], coord[0]);  
    });

    var polygon = new kakao.maps.Polygon({
        map: map,
        path: path,
        strokeWeight: 2,
        strokeColor: '#004c80',
        strokeOpacity: 0.8,
        fillColor: '#fff',
        fillOpacity: 0.7 
    });

 
     kakao.maps.event.addListener(polygon, 'mouseover', function() {
 
         polygon.setOptions({fillColor:'#09f'});
     });
 
     kakao.maps.event.addListener(polygon, 'mouseout', function() {
 
         polygon.setOptions({fillColor:'#fff'});
     });
     
 
     kakao.maps.event.addListener(polygon, 'click', function(mouseEvent) {

         var content = '<div style="padding:5px; font-size:0.8em; width:80px;">' + area.name + '</div>';

         infowindow.setPosition(mouseEvent.latLng);

         infowindow.setContent(content);

         infowindow.open(map);
      });
}
