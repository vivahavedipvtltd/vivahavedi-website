# API 22: Profile Details - Complete Response Example

## Request
```json
POST http://localhost:8000/api/profile-details
Headers:
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer {your-token}

Body:
{
  "match_id": 123
}
```

## Complete Response Structure

```json
{
  "status": "success",
  "data": {
    "basic": {
      "user_id": 123,
      "user_fname": "John",
      "user_lname": "Doe",
      "user_gender": "Male",
      "user_byear": 1995,
      "user_bmonth": 6,
      "user_bday": 15,
      "age": 28,
      "user_mobile": "9876543210",
      "user_email": "john.doe@example.com",
      "rel_name": "Hindu",
      "caste_name": "Brahmin",
      "con_name": "India",
      "state_name": "Maharashtra",
      "dist_name": "Mumbai",
      "lpo_name": "Andheri",
      "user_approval": "Yes",
      "user_activation": "Yes",
      "user_suspend": "No",
      "user_hide": "No"
    },
    "detailed": {
      "up_id": 456,
      "user_id": 123,

      // Physical Attributes
      "up_height": "5.8",
      "up_body_weight": "70",
      "up_body_type": "Average",
      "up_complexion": "Fair",
      "up_physical_status": "Normal",

      // Personal Details
      "up_marital_status": "Never Married",
      "up_children": "0",
      "up_mother_tongue": "Hindi",
      "up_personal_values": "Traditional",
      "up_about_myself": "I am a software engineer with a passion for technology...",

      // Education & Career
      "qual_id": 5,
      "ql_id": 2,
      "speci_id": 12,
      "pro_id": 8,
      "up_job_status": "Employed",
      "up_working_in": "Private Sector",
      "up_working_at": "Mumbai",
      "up_working_as": "Software Engineer",
      "up_company_name": "Tech Solutions Pvt Ltd",
      "up_designation": "Senior Developer",
      "up_annualincome": "1200000",
      "up_income": "1200000",

      // Family Background
      "up_family_values": "Traditional",
      "up_native": "Pune, Maharashtra",
      "up_father_name": "Rajesh Doe",
      "up_father_occupation": "Business",
      "up_mother_name": "Sunita Doe",
      "up_mother_occupation": "Homemaker",
      "up_brothers": "1",
      "up_mbrothers": "0",
      "up_sisters": "1",
      "up_msisters": "1",

      // Hobbies & Lifestyle
      "up_hobbies": ["Reading", "Music", "Travel"],
      "up_music": ["Classical", "Pop"],
      "up_reads": ["Fiction", "Technology"],
      "up_cuisine": ["South Indian", "Continental"],
      "up_diet": "Vegetarian",
      "up_drink": "No",
      "up_smoke": "No",

      // Completion Flags
      "up_complete": "yes",
      "up_education_complete": "1",
      "up_family_complete": "1",
      "up_hobbies_complete": "1"
    },
    "photo": {
      "photo": [
        "http://localhost:8000/images/user_images/photo1/123_1638345678.jpg",
        "http://localhost:8000/images/user_images/photo2/123_1638345679.jpg",
        "http://localhost:8000/images/user_images/photo3/123_1638345680.jpg"
      ],
      "photo_status": "visible"
    },
    "astro": {
      "uap_id": 789,
      "user_id": 123,
      "nak_id": 5,
      "nak_name": "Ashwini",
      "manglik": "No",
      "place_of_birth": "Mumbai",
      "city_of_birth": "Mumbai",
      "time_of_birth": "10:30:00",
      "b_hour": 10,
      "b_minute": 30,
      "b_second": 0,
      "horoscope": "http://localhost:8000/images/horoscope/123_horoscope.jpg",
      "horoscope_approval": "yes",
      "astro_profile": "Detailed astrological profile...",
      "astro_complete": "yes"
    },
    "partner": {
      "upp_id": 321,
      "user_id": 123,

      // Basic Preferences
      "upp_age_f": 25,
      "upp_age_t": 32,
      "upp_height_f": 160,
      "upp_height_t": 175,

      // Physical & Personal Preferences (comma-separated, converted to arrays)
      "upp_m_status": ["Never Married", "Divorced"],
      "upp_body_type": ["Slim", "Average"],
      "upp_complexion": ["Fair", "Wheatish"],
      "upp_physical_status": ["Normal"],
      "upp_mother_tongue": ["English", "Hindi"],
      "upp_res_status": ["Citizen", "Permanent Resident"],

      // Religion & Culture (resolved from IDs to names)
      "upp_relegion": "1|2",
      "religion": ["Hindu", "Sikh"],
      "upp_caste": "10|20",
      "caste": ["Brahmin", "Kshatriya"],
      "upp_sub_caste": "100|200",
      "sub_caste": ["Anavil", "Khedawal"],
      "upp_nakshatra": "3|5|8",
      "nakshatra": ["Rohini", "Ashwini", "Pushya"],

      // Location Preferences (resolved from IDs to names)
      "upp_country": "1",
      "country": ["India"],
      "upp_state": "15|16",
      "state": ["Maharashtra", "Delhi"],
      "upp_district": "150|160|170",
      "district": ["Mumbai", "Pune", "Thane"],

      // Education & Career Preferences (resolved from IDs to names)
      "upp_qualification_level": "2|3",
      "q_level": ["Graduate", "Post Graduate"],
      "upp_qualification": "5|8|12",
      "qualification": ["B.Tech", "MBA", "M.Tech"],
      "upp_spetialization": "15|20",
      "specialization": ["Computer Science", "Finance"],
      "upp_profession": "10|15|20",
      "profession": ["Software Engineer", "Business Analyst", "Project Manager"],

      // Completion Flags
      "upp_complete": "yes",
      "upp_religion_complete": "1",
      "upp_location_complete": "1",
      "upp_qualification_complete": "1"
    },
    "match": {
      "score": 72,
      "age": "yes",
      "height": "yes",
      "marital_status": "yes",
      "body_type": "no",
      "complexion": "yes",
      "physical_status": "yes",
      "relegion": "yes",
      "caste": "yes",
      "nakshathra": "no",
      "country": "yes",
      "state": "yes",
      "district": "yes",
      "qualification": "yes",
      "profession": "yes"
    },
    "communicaton": {
      "interest": "no",
      "shortlist": "yes",
      "block": "no",
      "report": "no"
    },
    "request": {
      "photo_add": false,
      "photo_view": true,
      "basic": false,
      "education": false,
      "family": false,
      "hobbies": false,
      "astro": false,
      "horoscope": false,
      "partner_basic": false,
      "partner_religion": false,
      "partner_location": false,
      "partner_education": false
    }
  }
}
```

## Response When Sections Are Empty

```json
{
  "status": "success",
  "data": {
    "basic": {
      "user_id": 124,
      "user_fname": "Jane",
      "user_lname": "Smith",
      "user_gender": "Female",
      "age": 26,
      "rel_name": "Christian",
      "caste_name": null,
      "state_name": "Karnataka",
      "dist_name": "Bangalore"
    },
    "detailed": {
      "up_id": 457,
      "user_id": 124,

      // Physical Attributes
      "up_height": "5.4",
      "up_body_weight": null,
      "up_body_type": "Slim",
      "up_complexion": "Fair",
      "up_physical_status": null,
      "up_marital_status": "Never Married",
      "up_mother_tongue": "English",

      // Education & Career - ALL EMPTY
      "up_job_status": null,
      "up_working_in": null,
      "up_working_at": null,
      "up_working_as": null,
      "up_company_name": null,
      "up_designation": null,
      "up_annualincome": null,
      "up_income": null,

      // Family Background - ALL EMPTY
      "up_family_values": null,
      "up_native": null,
      "up_father_name": null,
      "up_father_occupation": null,
      "up_mother_name": null,
      "up_mother_occupation": null,
      "up_brothers": null,
      "up_sisters": null,

      // Hobbies & Lifestyle - ALL EMPTY
      "up_hobbies": [],
      "up_music": [],
      "up_reads": [],
      "up_cuisine": [],
      "up_diet": null,
      "up_drink": null,
      "up_smoke": null,

      "up_about_myself": "Simple and caring person...",
      "up_education_complete": "0",
      "up_family_complete": "0",
      "up_hobbies_complete": "0"
    },
    "photo": {
      "photo": [
        "http://localhost:8000/images/avathar/female_l.png"
      ],
      "photo_status": "locked"
    },
    "astro": {
      "user_id": 124,
      "nak_name": null,
      "manglik": null,
      "place_of_birth": null,
      "time_of_birth": null,
      "horoscope": "no"
    },
    "partner": {
      "upp_age_f": 28,
      "upp_age_t": 35,
      "upp_height_f": 165,
      "upp_height_t": 180,
      "religion": ["Christian"],
      "state": ["Karnataka", "Tamil Nadu"],
      "qualification": ["Graduate"],
      "profession": []
    },
    "match": {
      "score": 45,
      "age": "no",
      "height": "yes",
      "marital_status": "yes",
      "relegion": "no",
      "state": "yes"
    },
    "communicaton": {
      "interest": "no",
      "shortlist": "no",
      "block": "no",
      "report": "no"
    },
    "request": {
      "photo_add": false,
      "photo_view": false,
      "basic": false,
      "education": true,    // Already requested!
      "family": true,       // Already requested!
      "hobbies": false,
      "astro": true,        // Already requested!
      "horoscope": false,
      "partner_basic": false,
      "partner_religion": false,
      "partner_location": false,
      "partner_education": false
    }
  }
}
```

## Field Descriptions

### Basic Section
- **user_id**: Unique user identifier
- **user_fname, user_lname**: First and last name
- **user_gender**: "Male" or "Female"
- **age**: Calculated age from birth date
- **user_mobile, user_email**: Contact details (privacy protected)
- **rel_name**: Religion name
- **caste_name**: Caste name
- **state_name, dist_name, lpo_name**: Location hierarchy
- **user_approval, user_activation**: Account status flags

### Detailed Section - Physical
- **up_height**: Height in feet.inches format (e.g., "5.8")
- **up_body_weight**: Weight in kg
- **up_body_type**: Slim, Average, Athletic, Heavy
- **up_complexion**: Fair, Wheatish, Dark
- **up_physical_status**: Normal, Physically Challenged

### Detailed Section - Education & Career
- **up_job_status**: Employed, Unemployed, Student, Self-employed
- **up_working_in**: Private Sector, Government, Business, etc.
- **up_working_at**: City/location of work
- **up_working_as**: Designation/role
- **up_company_name**: Employer name
- **up_designation**: Job title
- **up_annualincome/up_income**: Annual income in INR

### Detailed Section - Family
- **up_family_values**: Traditional, Modern, Liberal
- **up_native**: Native place/hometown
- **up_father_name**: Father's full name
- **up_father_occupation**: Father's profession
- **up_mother_name**: Mother's full name
- **up_mother_occupation**: Mother's profession
- **up_brothers**: Total number of brothers
- **up_mbrothers**: Number of married brothers
- **up_sisters**: Total number of sisters
- **up_msisters**: Number of married sisters

### Detailed Section - Hobbies & Lifestyle
- **up_hobbies**: Array of hobbies (Reading, Music, Travel, etc.)
- **up_music**: Array of music preferences (Classical, Pop, etc.)
- **up_reads**: Array of reading preferences (Fiction, Technology, etc.)
- **up_cuisine**: Array of favorite cuisines
- **up_diet**: Vegetarian, Non-Vegetarian, Eggetarian, Vegan
- **up_drink**: Yes, No, Occasionally, Socially
- **up_smoke**: Yes, No, Occasionally

### Photo Section
- **photo**: Array of photo URLs
- **photo_status**:
  - "visible" - Photos are publicly visible
  - "locked" - Photos are locked, need to request access
  - "avatar" - Using default gender avatar

### Astro Section
- **nak_name**: Nakshatra name (Ashwini, Bharani, etc.)
- **manglik**: Yes, No, Don't Know
- **place_of_birth/city_of_birth**: Birth location
- **time_of_birth**: Birth time in HH:MM:SS format
- **b_hour, b_minute, b_second**: Parsed time components
- **horoscope**: URL to horoscope image or "no"

### Partner Section
- **upp_age_f, upp_age_t**: Age range (from, to)
- **upp_height_f, upp_height_t**: Height range in cm
- **Arrays (converted from comma-separated)**: upp_m_status, upp_body_type, upp_complexion, upp_physical_status, upp_mother_tongue, upp_res_status
- **Resolved Arrays (from IDs)**: religion, caste, sub_caste, nakshatra, country, state, district, q_level, qualification, specialization, profession

### Match Section
- **score**: Overall compatibility percentage (0-100)
- **Individual matches**: "yes" or "no" for each attribute
  - age, height, marital_status, body_type, complexion, physical_status
  - relegion, caste, nakshathra
  - country, state, district
  - qualification, profession

### Communication Section
- **interest**: "yes" if you sent interest, "no" otherwise
- **shortlist**: "yes" if you shortlisted, "no" otherwise
- **block**: "yes" if you blocked, "no" otherwise
- **report**: "yes" if you reported, "no" otherwise

### Request Section
All boolean values:
- **false**: Request not sent yet (show "Request" button)
- **true**: Request already sent (show "Request Sent" message)

Types:
- **photo_add, photo_view**: Photo access requests
- **basic**: Basic profile request
- **education**: Education details request
- **family**: Family details request
- **hobbies**: Hobbies & lifestyle request
- **astro**: Astrological details request
- **horoscope**: Horoscope image request
- **partner_basic, partner_religion, partner_location, partner_education**: Partner preference requests

## Array Handling

### Fields that can be either Array or String:
```javascript
// API may return as string (from older data)
"up_hobbies": "Reading,Music,Travel"

// Or as array (from newer conversions)
"up_hobbies": ["Reading", "Music", "Travel"]

// Frontend handles both:
Array.isArray(detailed.up_hobbies)
  ? detailed.up_hobbies.join(', ')
  : detailed.up_hobbies
```

### Fields always returned as Arrays:
- Partner preferences: religion, caste, state, district, qualification, profession, etc.
- These are resolved from pipe-separated IDs (e.g., "1|2|3") to names

## Empty vs Null vs Missing

### null
```json
"up_father_name": null
```
Field exists in database but is empty

### Empty String
```json
"up_company_name": ""
```
Field exists but contains empty string

### Empty Array
```json
"up_hobbies": []
```
Array field with no values

### Missing/Undefined
Field not included in response (older records)

## Testing with cURL

```bash
# Get profile details
curl -X POST "http://localhost:8000/api/profile-details" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"match_id": 123}'

# Pretty print JSON
curl -X POST "http://localhost:8000/api/profile-details" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"match_id": 123}' | python -m json.tool
```

---

**End of API Response Documentation**
