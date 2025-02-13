import pandas as pd

df = pd.read_csv("Education2023.csv", encoding="ISO-8859-1")
df.to_json("output.json", orient="records", indent=4)

print("CSV successfully converted to JSON!")
