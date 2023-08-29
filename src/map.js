var mapContainer = document.getElementById('map');

var mapOption = {
    center: new kakao.maps.LatLng(35.824018302883686, 127.14790719550994),
    level: 10
};

var map = new kakao.maps.Map(mapContainer, mapOption);
 
var infowindow = new kakao.maps.InfoWindow({removable: true});

// data.json  
fetch('./json/data.json')
.then(response => response.json())
.then(data => {

    // 테이블 데이터 
    var tableBody = document.getElementById('table').getElementsByTagName('tbody')[0];
    for (let i=0; i<data.length; i++) {
        let rowHTML =
        `<tr class="${data[i]["행정동"]}">
            <td>${data[i]["구"] }</td>
            <td>${data[i]["행정동"] }</td>
            <td>${data[i]["전력소비량(G)"] }</td>
            <td>${data[i]["에너지절감률(%)"]+'%' }</td>
            <td>${data[i]["전기차충전소수"] }</td>
            <td>${data[i]["녹색아파트수"] }</td>
            <td>${data[i]["태양광설비수"] } </tr>`;
        tableBody.innerHTML += rowHTML;
        
    }

    // dong.json 파일 로드
    fetch('./json/dong.json')
    .then(response => response.json())
    .then(areas => {
        for (var i = 0, len = areas.length; i < len; i++) {
            displayArea(areas[i]);
        }
        
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

           // mouseover 이벤트 
           kakao.maps.event.addListener(polygon, 'mouseover', function() {

              polygon.setOptions({fillColor:'#09f'});
          });

          // mouseout  
          kakao.maps.event.addListener(polygon, 'mouseout', function() {

              polygon.setOptions({fillColor:'#fff'});
          });


               // 클릭 이벤트 
               kakao.maps.event.addListener(polygon, 'click', function(mouseEvent) {

                var content = '<div style="padding:5px; font-size:0.8em; width:80px;">' + area.name + '</div>';

                infowindow.setPosition(mouseEvent.latLng);

                infowindow.setContent(content);

                infowindow.open(map);
                
                 // 데이터 초기화  
                 var selectedRow = document.getElementsByClassName("selected")[0];
                 if (selectedRow) {
                     selectedRow.style.backgroundColor = "";
                     selectedRow.classList.remove("selected");
                     tableBody.appendChild(selectedRow);
                 }

                // 클릭한 데이터 배경색 초기화 
                 var clickedRow = document.getElementsByClassName(area.name)[0];
                 clickedRow.style.backgroundColor = "skyblue";
                 clickedRow.classList.add("selected");
                 tableBody.insertBefore(clickedRow, tableBody.childNodes[0]);
             });
         }
     });
 });