import sys
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def recommend_properties(user_search_history, properties):
    # Combine the user search history into a single string
    search_query = " ".join(user_search_history)

    # Combine the properties and search query into one list for vectorization
    all_text = [search_query] + properties  # User's search history + property descriptions

    # Vectorize the combined data
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(all_text)

    # Compute cosine similarity between the search query and properties
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])

    # Get top N similar properties
    top_n = 5
    recommended_property_indices = cosine_similarities.argsort()[0][-top_n:][::-1]

    return recommended_property_indices

if __name__ == "__main__":
    # Read arguments from Node.js
    user_search_history = json.loads(sys.argv[1])  # User search history
    properties = json.loads(sys.argv[2])  # Property descriptions

    # Get recommended properties indices
    recommended_indices = recommend_properties(user_search_history, properties)

    # Output the result as a JSON array
    print(json.dumps(recommended_indices))
