# CS-125-Health-App

Project created for our Winter 2020 CS 125 class.

Food diary based application that recommends meals and restaurants based on activity data (from Apple Healthkit) and dietary restrictions. Food consumption habits are learned and taken into account during the recommendation process. All meals and restaurants are curated and located near the UC Irvine campus.

![Activity Screen](Activity-screen.png)
![Diary Screen](Diary-screen.png)


## API Endpoint

Meals endpoint: https://gb6o73460i.execute-api.us-west-2.amazonaws.com/prod/meals

Sample POST request:
```
{
	"tags": ["vegan", "lunch"]
	"minCalories": 0,
	"maxCalories": 500
}
```
