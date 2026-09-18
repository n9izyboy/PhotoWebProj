Imports System
Imports System.Diagnostics
Imports System.IO

Module Program
    Sub Main()
        Dim outputDir = AppContext.BaseDirectory
        Dim indexPath = Path.Combine(outputDir, "wwwroot", "index.html")

        If Not File.Exists(indexPath) Then
            Console.WriteLine($"Could not find: {indexPath}")
            Return
        End If

        Try
            Dim psi As New ProcessStartInfo With {
                .FileName = indexPath,
                .UseShellExecute = True
            }
            Process.Start(psi)
            Console.WriteLine("Opened LensCraft website in your default browser.")
        Catch ex As Exception
            Console.WriteLine($"Failed to launch website: {ex.Message}")
        End Try
    End Sub
End Module
