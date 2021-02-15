from typing import Text
import requests
import json
import pprint as pp
from datetime import datetime
import re


def get_suggestions(search_string: str):
    base_url = 'https://utility.arcgis.com/usrsvcs/servers/b89ba3a68c664268b9bdea76948b4f11/rest/services/World/GeocodeServer/suggest'
    query_data = {
        'f': 'json',
        'text': search_string,
        'maxSuggestions': 60,
        'countryCode': 'BRA'
    }
    req = requests.get(base_url, params=query_data)
    res = json.loads(req.content)

    valid_suggestions = list(filter(lambda x: 'Curitiba' in x['text'], res['suggestions']))

    return valid_suggestions

def find_adress_candidates(single_line: str):
    base_url = 'https://utility.arcgis.com/usrsvcs/servers/b89ba3a68c664268b9bdea76948b4f11/rest/services/World/GeocodeServer/findAddressCandidates'
    query_data = {
        'f': 'json',
        'outSR': json.dumps({
            'wkid': 102100
        }),
        'outFields': '*',
        'countryCode': 'BRA',
        'maxLocations': 6,
        'SingleLine': single_line
    }

    req = requests.get(base_url, params=query_data)
    res = json.loads(req.content)

    return res

def get_codope(geometry):
    base_url = 'https://services1.arcgis.com/46Oage49MS2a3O6A/arcgis/rest/services/Mapa_Rodizio_Abastecimento_RMC_View/FeatureServer/1/query'
    query_data = {
        'f': 'json',
        'returnGeometry': False,
        'geometryType': 'esriGeometryPoint',
        'outFields': '*',
        'geometry': json.dumps(geometry)
    }

    req = requests.get(base_url, params=query_data)
    res = json.loads(req.content)

    codope = res['features'][0]['attributes']['codope']

    return codope

def get_by_codope(codope: str):
    base_url = 'https://services1.arcgis.com/46Oage49MS2a3O6A/arcgis/rest/services/Mapa_Rodizio_Abastecimento_RMC_View/FeatureServer/2/query'
    query_data = {
        'f': 'json',
        'returnGeometry': False,
        'outFields': '*',
        'where': "(CODOPE = '{}')".format(codope)
    }

    req = requests.get(base_url, params=query_data)
    res = json.loads(req.content)

    return res

def print_time_stamps(query_data):
    data = query_data['features']
    for entry in data:
        entry = entry['attributes']
        ts_retomada = datetime.fromtimestamp(entry['RETOMADA'] / 1000)
        ts_norm = datetime.fromtimestamp(entry['NORMALIZACAO'] / 1000)
        ts_init = datetime.fromtimestamp(entry['INICIO'] / 1000)

        print('INICIO: {} / NORMALIZACAO: {} / RETOMADA: {}'.format(ts_init, ts_norm, ts_retomada))



if __name__ == '__main__':
    suggestions = get_suggestions(search_string='Jose Clementino Bettega')
    # pp.pprint(suggestions)

    single_line = suggestions[0]['text']
    res = find_adress_candidates(single_line=single_line)

    geometry = res['candidates'][0]['location']
    geometry['spatialReference'] = {
        'wkid': 102100
    }

    codope = get_codope(geometry)
    res = get_by_codope(codope)

    print('Results query by codope')
    pp.pprint(res)

    # print_time_stamps(res)
    print('CODOPE: {}'.format(codope))

    # pp.pprint(res)