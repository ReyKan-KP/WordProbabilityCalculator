import collections
import re
import os
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
nltk.download('punkt')
nltk.download('stopwords')


def calculate_word_probabilities(text, stop_words):
    words = word_tokenize(text.lower())
    filtered_words = [word for word in words if word.isalnum()
                      and word not in stop_words]
    return filtered_words


stop_words = set(stopwords.words('english'))

folder_path = 'documents'

all_word_counts = collections.Counter()

for file_name in os.listdir(folder_path):
    if file_name.endswith('.txt'):
        file_path = os.path.join(folder_path, file_name)
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                document_text = file.read()
                filtered_words = calculate_word_probabilities(
                    document_text, stop_words)
                word_counts = collections.Counter(filtered_words)
                all_word_counts.update(word_counts)
        except UnicodeDecodeError:
            print(
                f"Error decoding {file_name} with UTF-8 encoding. Trying another encoding...")
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    document_text = file.read()
                    filtered_words = calculate_word_probabilities(
                        document_text, stop_words)
                    word_counts = collections.Counter(filtered_words)
                    all_word_counts.update(word_counts)
            except Exception as e:
                print(f"Error decoding {file_name} with Latin-1 encoding: {e}")

total_words = sum(all_word_counts.values())
top_words = all_word_counts.most_common(5)
word_probabilities = [(word, count / total_words, count)
                      for word, count in top_words]

print("Top 5 words across all documents:")
for word, probability, count in word_probabilities:
    print(f'  Word: {word}, Probability: {probability:.4f}, Count: {count}')
print()
