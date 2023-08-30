import json
import folium
from folium.features import GeoJson, GeoJsonTooltip
import pandas as pd

# 데이터프레임 로드
df = pd.read_json('src/json/ironMan.json')

# 행정동 이름을 key로, 합계 값을 value로 하는 딕셔너리 생성
data_dict = df.set_index('행정동')['합계'].to_dict()

# dong.json 파일 로드 및 GeoJSON 변환 
with open('src/json/dong.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

geo_data = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {"name": d['name']},
            "geometry": {
                "type": "Polygon",
                "coordinates": [d['path']]
            }
        } for d in data]
}

 
m = folium.Map(location=[35.8216, 127.1080], zoom_start=12, width=500, height=500)

 
bins = list(df['합계'].quantile([0, 0.35,  0.55,  0.75, 0.95, 1]))

g = folium.GeoJson(
    geo_data,
    style_function=lambda feature: {
        'fillColor': '#black',
        'color': 'black',
        'weight': 2,
        'dashArray': '5, 5'
    }
)



tooltip=GeoJsonTooltip(
    fields=["name"],
    aliases=["행정동:"],
    localize=True,
     sticky=True,
     labels=True,
     style="""
         background-color: #F0EFEF;
         border: 2px solid black;
         border-radius: 3px;
         box-shadow: 3px;
     """,
     max_width=800,
)

g.add_child(tooltip)
m.add_child(g)

choro =  folium.Choropleth(
   geo_data=geo_data,
   name='choropleth',
   data=data_dict,
   fill_color='YlGn',  
   fill_opacity=0.5,
   line_opacity=0.2,
   key_on='feature.properties.name',
   bins=bins,
).add_to(m)

choro.geojson.add_child(
    folium.features.GeoJsonTooltip(['name'], labels=False)
)

folium.LayerControl().add_to(m)


m.save('src/energySave.html')