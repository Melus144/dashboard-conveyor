import yaml

def load_yaml(file_path):
    with open(file_path, 'r') as file:
        settings = yaml.safe_load(file)
    return settings

