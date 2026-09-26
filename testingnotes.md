# Tests

#### Put something weird in ```food.partnerHaveAgain``` field. 

I did a 'yy' instead of the expected y/n. The site loaded fine and counted the food, but when the modal pops up the journal page is not able to be created.

```javascript
RangeError: String.prototype.repeat argument must be greater than or equal to 0 and not be Infinity
```

##### FIX 
Give only acceptable options in the form that will populate the spreadsheet. 

---
#### Empty ```food.cristylesRating``` and ```food.cristyleHaveAgain``` fields

No issues marked as probably not like it should. 

---
---
#### Empty ```location.crisGoBack``` and ```location.partnerGoBack``` fields

No issues. Both were marked as maybe or not sure as expected. 

---
---
#### Putting a number outside of the 1-5 range in ```food.cristylesRating``` or ```food.partnersRating``` fields.

Journal page doesn't open up

```javascript
RangeError: String.prototype.repeat argument must be greater than or equal to 0 and not be Infinity
```

##### FIX
Make the field in the form only allow numbers in the acceptable range. 

---
---
#### ```food.foodDate``` is a future date that hasn't happened yet. 

added the food to the map and has a journal entry with the future date

##### FIX
Maybe make to form limit date options to once within an acceptable range? Or ask if want to add with a future date?

---
---
#### Put a character other than y/n in ```food.cristyleHaveAgain``` field. 

data loads and opens the journal entry. It marked it as 'Probably not' which is the response for if it's not true or false. 

##### FIX
This is what we want if it's doing it right. I worried a non true/false value would break things but defaulting to the third options works for me. 

---
---
#### Put a 0 in the ```food.cristylesRating``` field 

journal card can't load

```javascript
RangeError: String.prototype.repeat argument must be greater than or equal to 0 and not be Infinity
```

##### FIX
give only the 1-5 options for the field in the form. 

---
---
#### *Describe test 

*What happened*

##### FIX
*what was done or should be done to fix?

---
---
#### *Describe test 

*What happened*

##### FIX
*what was done or should be done to fix?

---
---
#### *Describe test 

*What happened*

##### FIX
*what was done or should be done to fix?

---
