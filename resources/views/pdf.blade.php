<!DOCTYPE html>
<html>
<head>
    <title>Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .cards { margin-top: 20px; }
        .card { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
    </style>
</head>
<body>
<h1>Report</h1>
@if($customText)
    <div>{!! $customText !!}</div>
@endif
@if(!empty($cards))
    <div class="cards">
        <h2>Key Indicators</h2>
        @foreach($cards as $card)
            <div class="card">
                <strong>{{ $card['title'] }}</strong>: {{ $card['value'] }}
            </div>
        @endforeach
    </div>
@endif
@if($registries)
    <table>
        <thead>
        <tr>
            @foreach($selectedColumns as $column)
                <th>{{ Str::title(str_replace('_', ' ', $column)) }}</th>
            @endforeach
        </tr>
        </thead>
        <tbody>
        @foreach($registries as $registry)
            <tr>
                @foreach($selectedColumns as $column)
                    <td>{{ $registry[$column] }}</td>
                @endforeach
            </tr>
        @endforeach
        </tbody>
    </table>
@endif
</body>
</html>
