import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 3000;
const API_URL = "https://jisho.org/api/v1/search/words";

app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.urlencoded({extended: true})); // Essential for parsing form data
app.use(express.static("public"));
app.use(cors()); // While not strictly needed for this form submission, it doesn't hurt

// Initial page load (GET request to /)
app.get("/", async(req, res)=>{
    // Render the page with empty results and default filter values
    res.render("index.ejs", {
        target_words: [],
        query: "",
        category: "Words", // Default dropdown value
        level: "",        // Default JLPT level (none selected)
        wordType: "Verbs", // Default radio button selected
        no_result_message: ""
    });
});

// Handle search form submission (POST request to /search)
app.post("/search", async(req,res)=>{
    // Get all form data from req.body (thanks to express.urlencoded)
    const {query, category, level, wordType} = req.body;
    console.log("Request body from client:", req.body);

    // Prepare filter variables based on submitted form data
    let is_common_filter = undefined;
    let jlpt_level_filter = undefined;
    let word_type_filter = undefined;

    if (level === "Common") {
        is_common_filter = true;
    } else if (level && level.startsWith("JLPT")) {
        jlpt_level_filter = level; // e.g., "JLPT N5"
    }

    if (wordType) {
        word_type_filter = wordType;
    }

    // Basic validation: ensure at least a query or some filter is present
    if (!query && !is_common_filter && !jlpt_level_filter && !word_type_filter) {
        console.log("No meaningful query or filter selected.");
        return res.render("index.ejs", {
            target_words: [],
            query: query || "",
            category: category || "Words",
            level: level || "",
            wordType: wordType || "Verbs",
            error: "Please enter a word to search or select filtering options."
        });
    }

    try {
        console.log(`Request to Jisho API: ${API_URL}?keyword=${encodeURIComponent(query)}`);
        const response = await axios.get(`${API_URL}?keyword=${encodeURIComponent(query)}`,{
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        const data = response.data.data;

        console.log(`Response from Jisho: ${data.length} entries found.`);

        // Filter the results based on selected criteria
        const filtered = data.filter(entry=>{
            // Filter by 'Common' status
            if (is_common_filter !== undefined) {
                if (is_common_filter && !entry.is_common) {
                    return false; // If 'Common' is requested but entry is not common
                }
            }

            // Filter by JLPT level
            if(jlpt_level_filter){
                // Jisho API uses "jlpt-n5" format, so convert "JLPT N5"
                const jisho_jlpt_format = jlpt_level_filter.toLowerCase().replace(" ", "-");
                if(!entry.jlpt || !entry.jlpt.includes(jisho_jlpt_format)){
                    return false;
                }
            }

            // Filter by word type (Part of Speech)
            if(word_type_filter){
                // Convert client's "Nouns" to "noun" for better matching
                const expected_pos_substring = word_type_filter.toLowerCase().slice(0, -1);
                const found = entry.senses.some(sense=>
                    sense.parts_of_speech.some(pos=>
                        pos.toLowerCase().includes(expected_pos_substring)
                    )
                );
                if(!found) return false;
            }
            return true;
        });

        console.log(`Filtered result: ${filtered.length} entries.`);
        if(filtered.length == 0){
            dictionaryStatus = true;
            res.render("index.ejs", {
                target_words: [],
                query: query || "",
                category: category || "Words",
                level: level || "",
                wordType: wordType || "Verbs",
                no_result_message: "No result found in that section!"
            });
        } else {
            res.render("index.ejs", {
                target_words: filtered,
                query: query || "",
                category: category || "Words",
                level: level || "",
                wordType: wordType || "Verbs",
                no_result_message: ""
            });
        }

    } catch (error) {
        console.error("API error", error.message);
        let errorMessage = "Error fetching data from Jisho API";
        if (error.response) {
            console.error("Jisho API Response Error:", error.response.data);
            errorMessage = `Error: ${error.response.status} - ${error.response.data.message || 'An unknown error occurred.'}`;
        }
        // Render the page with an error message and preserved form values
        res.render("index.ejs", {
            target_words: [], // No results on error
            query: query || "",
            category: category || "Words",
            level: level || "",
            wordType: wordType || "Verbs",
            error: errorMessage // Pass the error message to the EJS template
        });
    }
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});