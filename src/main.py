import os
import pandas as pd
from data_processor import process_data
from signal_generator import generate_signals
from chart_generator import create_chart
from performance_analyzer import analyze_performance

def main():
    csv_path = 'csvs'
    charts_path = 'charts'

    if not os.path.exists(charts_path):
        os.makedirs(charts_path)

    for file in os.listdir(csv_path):
        if file.endswith('.csv'):
            print(f'Processing file: {file}')
            
            # Load and process data
            df = pd.read_csv(os.path.join(csv_path, file))
            df = process_data(df)

            # Generate trading signals
            df = generate_signals(df)

            # Analyze performance
            performance_metrics = analyze_performance(df)

            # Create and save chart
            chart_file = os.path.join(charts_path, f'{os.path.splitext(file)[0]}.html')
            create_chart(df, performance_metrics, chart_file)

            print(f'Chart saved: {chart_file}')
            print(f'Performance metrics: {performance_metrics}')

if __name__ == "__main__":
    main()